using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dto.Saved;
using backend.Model;

namespace backend.Mapper
{
    public static class SavedMapper
    {
        public static SavedBookDto ToSavedBookDto(this SavedBooks book)
        {
            return new SavedBookDto
            {
                Book = book.UserBook.ToUserBookSummaryDto(),
                UserAccountId = book.User.AccountId
            };
        }

        public static SavedPostDto ToSavedPostDto(this SavedPosts post)
        {
            return new SavedPostDto
            {
                Post = post.ReadingPost.ToReadingPostDto(),
                UserAccountId = post.User.AccountId
            };
        }
    }
}