using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Book;
using backend.Dto.UserBook;
using backend.Enums;
using backend.Model;
using Clerk.BackendAPI.Models.Components;

namespace backend.Mapper
{
    public static class BooksMapper
    {
        public static UserBookListinDetailDto ToUserBookListingDetailDto(this UserBook userBook)
        {
            if (userBook.Book == null) throw new InvalidOperationException("userBook.Book is null");
            return new UserBookListinDetailDto
            {
                UserBookId = userBook.Id,
                bookCondition = userBook.BookCondition,
                SellerPayMethods = userBook.SellerPayMethods.Select(pm => pm.PayMethod).ToList(),
                SellerDeliveryMethods = userBook.SellerDeliveryMethods.Select(pm => pm.DeliveryMethod).ToList(),
                Price = userBook.Price,
                UserBookStatus = userBook.UserBookStatus,
                CreatedAt = userBook.CreatedAt,
                SellerAccountId = userBook.AppUser?.AccountId ?? null,
                Book = new UserBookSummaryDto
                {
                    UserBookId = userBook.Id,
                    ISBN = userBook.Book.ISBN,
                    Title = userBook.Book.Title,
                    Author = userBook.Book.Author,
                    Description = userBook.Book.Description,
                    BookCategory = userBook.Book.BookCategory
                }
            };
        }

        public static UserBookSummaryDto ToUserBookSummaryDto(this UserBook userBook)
        {
            if (userBook.Book == null) throw new InvalidOperationException("userBook.Book is null");
            return new UserBookSummaryDto
            {
                UserBookId = userBook.Id,
                Title = userBook.Book.Title,
                ISBN = userBook.Book.ISBN,
                Author = userBook.Book.Author,
                Description = userBook.Book.Description,
                BookCategory = userBook.Book.BookCategory
            };
        }

        public static UserBook ToUserBookModelFromUpload(this UploadUserBooksDto uploadDto)
        {
            return new UserBook
            {
                BookCondition = uploadDto.bookCondition,
                SellerPayMethods = uploadDto.SellerPayMethods
                    .Select(pm => new UserBookPayMethod { PayMethod = pm })
                    .ToList(),
                SellerDeliveryMethods = uploadDto.SellerDeliveryMethods
                    .Select(dm => new UserBookDeliveryMethod { DeliveryMethod = dm })
                    .ToList(),
                Price = uploadDto.Price,
                UserBookStatus = uploadDto.UserBookStatus,
                CreatedAt = uploadDto.CreatedAt,
            };
        }

        public static Book ToBookModelDto(this UserBookSummaryDto bookSummaryDto)
        {
            return new Book
            {
                Title = bookSummaryDto.Title,
                ISBN = bookSummaryDto.ISBN,
                Author = bookSummaryDto.Author,
                Description = bookSummaryDto.Description,
                BookCategory = bookSummaryDto.BookCategory
            };
        }
    }
}