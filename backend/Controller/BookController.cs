using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controller
{
    [Route("/api/books")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBooksRepository _booksRepo;
        private readonly IAppUserService _userService;
        public BookController(IBooksRepository booksRepo, IAppUserService userService)
        {
            _booksRepo = booksRepo;
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _booksRepo.GetAllAsync();
            if (books == null) return NotFound("No book in database");
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
    }
}