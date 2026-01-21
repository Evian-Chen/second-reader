using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using backend.Dto.Book;
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

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _booksRepo.GetAllAsync();
            if (books == null) return NotFound("No book in database");
            return Ok(books.Select(b => b.ToUserBookSummaryDto()).ToList());
        }

        [HttpGet("{accountId}")]
        public async Task<IActionResult> GetBooksByAccountId([FromRoute] string accountId, [FromQuery] UserBookStatusFilterDto query)
        {
            var books = await _booksRepo.GetBooksByAccountIdAsync(accountId, query);
            if (!books.Any()) return NotFound();
            return Ok(books.Select(b => b.ToUserBookSummaryDto()).ToList());
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetBookById([FromRoute] int id)
        {
            if (!ModelState.IsValid) return BadRequest();
            var book = await _booksRepo.GetBookByIdAsync(id);
            if (book == null) return NotFound();
            return Ok(book.ToUserBookListingDetailDto());
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> EditUserBookById([FromRoute] int id, [FromBody] UpdateUserBookDto updateUserBookDto)
        {
            // 不允許更改書本身的內容，因為書籍在上架時就會被放入資料庫（TODO: 加入驗證書籍存在的機制）
            var userBook = await _booksRepo.EditUserBookById(id, updateUserBookDto);
            if (userBook == null) return NotFound();
            return Ok(userBook.ToUserBookListingDetailDto());
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteBookById([FromRoute] int id)
        {
            var book = await _booksRepo.DeleteBookByIdAsync(id);
            return book == null ? BadRequest() : Ok();
        }

        [HttpPost("search")]
        public async Task<IActionResult> GetBookSearchResult([FromBody] BookSearchQueryDto bookSearchQueryDto)
        {
            if (!ModelState.IsValid) return BadRequest();
            var resultList = await _booksRepo.GetBookSearchResult(bookSearchQueryDto);
            if (resultList == null) return NotFound("No book satisfied the search query.");
            return Ok(resultList.Select(b => b.ToUserBookSummaryDto()));
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> UploadBooks([FromBody] List<UploadUserBooksDto> uploadDtos)
        {
            if (!ModelState.IsValid) return BadRequest();
            var appUser = HttpContext.Items["AppUser"] as AppUser;
            if (appUser == null) return Unauthorized();
            if (uploadDtos == null || uploadDtos.Count == 0) return BadRequest("No book to upload.");

            var uploadedBooksModels = await _userService.CreateUserBookAsync(uploadDtos, appUser);
            return Ok(uploadedBooksModels.Select(u => u.ToUserBookSummaryDto()).ToList());
        }

        [HttpPost("isbn")]
        [Consumes("multipart/form-data")]
        [Authorize]
        public async Task<IActionResult> PrefillBooksInfoByIsbn([FromForm] OcrIsbnForm ocrIsbnForm)
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