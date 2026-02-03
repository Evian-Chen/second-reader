using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.GoogleBook;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace backend.Controller
{
    [Route("/api/books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBooksRepository _booksRepo;
        private readonly IAppUserService _userService;
        private readonly IOcrService _ocrService;
        private readonly IGoogleBookService _googleService;
        public BookController(IBooksRepository booksRepo, IAppUserService userService, IOcrService ocrService, IGoogleBookService googleService)
        {
            _booksRepo = booksRepo;
            _userService = userService;
            _ocrService = ocrService;
            _googleService = googleService;
        }

        /// <summary>
        /// 取得所有書籍
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<UserBookSummaryDto>>> GetAllBooks()
        {
            var books = await _booksRepo.GetAllAsync();
            return Ok(books.Select(b => b!.ToUserBookSummaryDto()).ToList());
        }

        /// <summary>
        /// 取得特定使用者的上架書籍
        /// </summary>
        /// <param name="accountId">使用者帳號</param>
        /// <param name="query">篩選書籍的狀態</param>
        /// <returns></returns>
        [HttpGet("{accountId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserBookSummaryDto>> GetBooksByAccountId([FromRoute] string accountId, [FromQuery] UserBookStatusFilterDto query)
        {
            var books = await _booksRepo.GetBooksByAccountIdAsync(accountId, query);
            return Ok(books!.Select(b => b.ToUserBookSummaryDto()).ToList());
        }

        /// <summary>
        /// 使用 ID 取得書
        /// </summary>
        /// <param name="id">書本 ID</param>
        /// <returns></returns>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserBookListinDetailDto>> GetBookById([FromRoute] Guid id)
        {
            var book = await _booksRepo.GetBookByIdAsync(id);
            if (book == null) return NotFound();
            return Ok(book.ToUserBookListingDetailDto());
        }

        /// <summary>
        /// 用 ID 更新一本已上架書籍
        /// </summary>
        /// <param name="id">書的 ID</param>
        /// <param name="updateUserBookDto">書的更新內容（全覆蓋）</param>
        /// <returns></returns>
        [HttpPut("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserBookListinDetailDto>> EditUserBookById([FromRoute] Guid id, [FromBody] UpdateUserBookDto updateUserBookDto)
        {
            // 不允許更改書本身的內容，因為書籍在上架時就會被放入資料庫（TODO: 加入驗證書籍存在的機制）
            var userBook = await _booksRepo.EditUserBookById(id, updateUserBookDto);
            if (userBook == null) return NotFound();
            return Ok(userBook.ToUserBookListingDetailDto());
        }

        /// <summary>
        /// 用 ID 下架一本書
        /// </summary>
        /// <param name="id">書的 ID</param>
        /// <param name="hard">是否連帶刪除資料庫的書籍資料</param>
        /// <returns></returns>
        [HttpDelete("{id:guid}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserBookSummaryDto>> DeleteBookById([FromRoute] Guid id, [FromQuery] bool? hard)
        {
            var book = await _booksRepo.DeleteBookByIdAsync(id, hard);
            return book == null ? BadRequest() : Ok(book.ToUserBookSummaryDto());
        }

        /// <summary>
        /// 搜尋書籍
        /// </summary>
        /// <param name="bookSearchQueryDto">可搜尋的欄位（必須完全匹配）</param>
        /// <returns></returns>
        [HttpPost("search")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserBookSummaryDto>> GetBookSearchResult([FromBody] BookSearchQueryDto bookSearchQueryDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var resultList = await _booksRepo.GetBookSearchResult(bookSearchQueryDto);
            if (resultList == null) return NotFound("No book satisfied the search query.");
            return Ok(resultList.Select(b => b.ToUserBookSummaryDto()));
        }

        /// <summary>
        /// 上架一或多本書
        /// </summary>
        /// <param name="uploadDtos">書籍資訊，UserBookId 不需填寫</param>
        /// <returns></returns>
        /// <exception cref="UnauthorizedAccessException"></exception>
        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<UserBookSummaryDto>>> UploadBooks([FromBody] List<UploadUserBooksDto> uploadDtos)
        {
            if (!ModelState.IsValid) return BadRequest();
            var appUser = HttpContext.Items["AppUser"] as AppUser ?? throw new UnauthorizedAccessException();
            if (uploadDtos == null || uploadDtos.Count == 0) return BadRequest("No book to upload.");

            var uploadedBooksModels = await _userService.CreateUserBookAsync(uploadDtos, appUser);
            return Ok(uploadedBooksModels.Select(u => u.ToUserBookSummaryDto()).ToList());
        }

        /// <summary>
        /// 透過照片自動填寫書籍資訊
        /// </summary>
        /// <param name="ocrIsbnForm">包含 ISBN 的照片</param>
        /// <returns></returns>
        [HttpPost("isbn")]
        [Consumes("multipart/form-data")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<GoogleBookResultDto>> PrefillBooksInfoByIsbn([FromForm] OcrIsbnForm ocrIsbnForm)
        {
            // 會回傳預填好的 Book 內容，前端填入 UI，等使用者確定要上傳再去打 POST api/books
            var isbn = await _ocrService.ExtractIsbnAsync(ocrIsbnForm.Img);
            if (isbn == null) return BadRequest("isbn can not be extracted.");
            var googleResult = await _googleService.GetByIsbnAsync(isbn);
            if (googleResult == null) return NotFound();
            return Ok(googleResult);
        }
    }
}