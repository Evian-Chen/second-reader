using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dto.Comment;
using backend.Interface;
using backend.Mapper;
using backend.Model;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly ApplicationDBContext _context;
        private readonly IMeNotificationRepository _notiRepo;
        public CommentRepository(ApplicationDBContext context, IMeNotificationRepository notiRepo)
        {
            _context = context;
            _notiRepo = notiRepo;
        }

        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto createCommentDto, AppUser user)
        {
            var commentId = Guid.NewGuid();
            Guid rootId = commentId;
            var depth = 0;
            var childCommentCount = 0;
            // 先假設只有 root comment 需要 child comment count

            var post = await _context.ReadingPosts.Include(r => r.AppUser).FirstOrDefaultAsync(r => r.Id == createCommentDto.PostId)
                            ?? throw new InvalidOperationException("No such post.");

            if (createCommentDto.ParentId != null)  // 非第一筆留言
            {
                var parentComment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == createCommentDto.ParentId)
                                        ?? throw new InvalidOperationException("No such parent comment.");
                rootId = parentComment.RootId;
                depth = parentComment.Depth + 1;

                var rootComment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == rootId)
                                        ?? throw new InvalidOperationException("No such root comment.");
                rootComment.ChildCommentCount++;

                if (rootComment.Author.Id != user.Id)
                {
                    await _notiRepo.InformCommentCreaterNewCommentAsync(user, rootComment.Id);
                }
            }

            var newComment = new Comment
            {
                Id = commentId,
                Content = createCommentDto.Content,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow,

                PostId = createCommentDto.PostId,
                ParentId = createCommentDto.ParentId,
                RootId = rootId,
                Depth = depth,
                ChildCommentCount = childCommentCount,

                AuthorId = user.Id,
                AuthorAccountId = user.AccountId,
                Author = user
            };

            if (user.Id != post.AppUser!.Id)
            {
                await _notiRepo.InformPostCreaterNewCommentAsync(user, post.Id);
            }

            var result = await _context.Comments.AddAsync(newComment);
            post.CommentCount++;
            await _context.SaveChangesAsync();
            return result.Entity.FromCommentModelToCommentDto();
        }

        public async Task DeleteCommentAsync(Guid commentId, AppUser user)
        {
            var existing = await _context.Comments.FirstOrDefaultAsync(c => c.Id == commentId && c.Author.Id == user.Id)
                                ?? throw new InvalidOperationException("This user does not own this comment");
            existing.IsDeleted = true;
            await _context.SaveChangesAsync();
            return;
        }

        public async Task<List<CommentDto>> GetChildCommentsByRootIdAsync(Guid rootId)
        {
            var comments = await _context.Comments.Where(c => c.RootId == rootId).ToListAsync()
                                ?? throw new InvalidOperationException("No such comment root id.");
            return [.. comments.Select(c => c.FromCommentModelToCommentDto())];
        }

        public async Task<List<CommentDto>> GetRootCommentsByPostIdAsync(Guid postId)
        {
            var comments = await _context.Comments.Where(c => c.PostId == postId && c.Id == c.RootId).ToListAsync()
                                ?? throw new InvalidOperationException("No such post id.");
            return [.. comments.Select(c => c.FromCommentModelToCommentDto())];
        }
    }
}

/*
https://www.instagram.com/api/v1/media/3799066249843054737/comments/?can_support_threading=true&permalink_enabled=false

{
    "can_view_more_preview_comments": false,
    "caption": {
        "bit_flags": 0,
        "content_type": "comment",
        "created_at": 1767104171,
        "created_at_for_fb_app": 1767104171,
        "created_at_utc": 1767104171,
        "did_report_as_spam": false,
        "is_covered": false,
        "is_created_by_media_owner": true,
        "is_ranked_comment": false,
        "media_id": "3799066249843054737",
        "pk": "17855207997596846",
        "private_reply_status": 0,
        "share_enabled": true,
        "status": "Active",
        "strong_id__": "17855207997596846",
        "text": "去看台北沒有的東西\n-\n喜歡山的味道\n還有刺骨的風\n-\n我覺得山看起來毛茸茸的\n應該很好摸",
        "type": 1,
        "user": {
            "fbid_v2": "17841411022248072",
            "full_name": "Evian Chen",
            "has_onboarded_to_text_post_app": true,
            "id": "10864583408",
            "is_private": false,
            "is_unpublished": false,
            "is_verified": false,
            "pk": "10864583408",
            "pk_id": "10864583408",
            "profile_pic_id": "3836760041400221668_10864583408",
            "profile_pic_url": "https://scontent.cdninstagram.com/v/t51.82787-19/634409242_18184300927367409_5028648989152821044_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=QQHXCaRvLkAQ7kNvwGMJU_R&_nc_oc=AdlKH7PQU39oiRDIuM5NFN3HSSaW6gJDhhHwzke1rFfV8MDWx6CvnaFjCIruaExY1bQ&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=aligW3tiZ1Qcc_jFyTKxsA&_nc_ss=8&oh=00_AfvxAf0VrDJp9piwO7Eips9cXP_xn9ZRRhhXqmZNbxNfHg&oe=69A813A7",
            "strong_id__": "10864583408",
            "username": "paramecium_domain"
        },
        "user_id": "10864583408"
    },
    "caption_is_edited": true,
    "comment_count": 2,
    "comment_cover_pos": "bottom",
    "comment_filter_param": "no_filter",
    "comment_likes_enabled": true,
    "comments": [
        {
            "bit_flags": 0,
            "child_comment_count": 1,
            "comment_index": 0,
            "comment_like_count": 0,
            "content_type": "comment",
            "created_at": 1767113384,
            "created_at_for_fb_app": 1767113384,
            "created_at_utc": 1767113384,
            "did_report_as_spam": false,
            "has_liked_comment": false,
            "has_disliked_comment": false,
            "has_more_head_child_comments": true,
            "has_more_tail_child_comments": false,
            "inline_composer_display_condition": "never",
            "is_covered": false,
            "is_photo_comments_enabled_for_comment_author": false,
            "is_text_editable": false,
            "is_edited": false,
            "is_ranked_comment": false,
            "keywords_data": [],
            "liked_by_media_coauthors": [],
            "other_preview_users": [],
            "media_id": "3799066249843054737",
            "num_head_child_comments": 1,
            "pk": "18073576745526689",
            "preview_child_comments": [],
            "private_reply_status": 0,
            "restricted_status": 0,
            "share_enabled": true,
            "status": "Active",
            "strong_id__": "18073576745526689",
            "text": "那根木棍完美到限動出現一次貼文再出現一次😍😍",
            "type": 0,
            "user": {
                "fbid_v2": "17841410567119797",
                "full_name": "Cathy  Chen",
                "id": "10638376237",
                "is_mentionable": true,
                "is_private": true,
                "is_verified": false,
                "latest_reel_media": 1772201928,
                "pk": "10638376237",
                "pk_id": "10638376237",
                "profile_pic_id": "3786853120870660142_10638376237",
                "profile_pic_url": "https://scontent.cdninstagram.com/v/t51.82787-19/599416935_18185866795352238_6236340326190931431_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=TR8YVwsIyUcQ7kNvwELC387&_nc_oc=Adn6nYYQ-dYG4fr2to3EczGsfggLjZknIWFRlTckfCSMcUcRdELtOxdArddjH09fYSU&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=aligW3tiZ1Qcc_jFyTKxsA&_nc_ss=8&oh=00_Afv9VqS8QtdR7unbmy0VWAb0xTjUYg4hQbI5287rTyt9Wg&oe=69A836AD",
                "strong_id__": "10638376237",
                "username": "cathy.chen.0317",
                "qe_use_smaller_comment_like_tap_target": true
            },
            "fallback_user_info": {
                "id": "10638376237"
            },
            "user_id": "10638376237"
        }
    ],
    "has_more_comments": false,
    "has_more_headload_comments": false,
    "initiate_at_top": true,
    "insert_new_comment_to_top": true,
    "liked_by_media_owner_badge_enabled": true,
    "media_header_display": "none",
    "quick_response_emojis": [
        {
            "unicode": "❤️"
        },
        {
            "unicode": "🙌"
        },
        {
            "unicode": "🔥"
        },
        {
            "unicode": "👏"
        },
        {
            "unicode": "😢"
        },
        {
            "unicode": "😍"
        },
        {
            "unicode": "😮"
        },
        {
            "unicode": "😂"
        }
    ],
    "scroll_behavior": 1,
    "sort_order": "popular",
    "threading_enabled": true,
    "filter_options": [],
    "sort_options": [],
    "should_render_upsell": false,
    "foundation_improvements_enabled": true,
    "high_score_comment_count": 1,
    "has_more_headload_fb_comments": false,
    "fb_comments": [],
    "ai_topic_filters": [],
    "status": "ok"
}
*/


/*
https://www.instagram.com/api/v1/media/3799066249843054737/comments/18073576745526689/child_comments/?min_id=&is_chronological=true&paging_direction=view_more

{
    "child_comment_count": 1,
    "child_comments": [
        {
            "bit_flags": 0,
            "child_comment_index": 0,
            "comment_like_count": 0,
            "content_type": "comment",
            "created_at": 1767142843,
            "created_at_for_fb_app": 1767142843,
            "created_at_utc": 1767142843,
            "did_report_as_spam": false,
            "has_disliked_comment": false,
            "has_liked_comment": false,
            "is_covered": false,
            "is_created_by_media_owner": true,
            "is_photo_comments_enabled_for_comment_author": false,
            "is_text_editable": false,
            "is_edited": false,
            "is_ranked_comment": false,
            "liked_by_media_coauthors": [],
            "media_id": "3799066249843054737",
            "parent_comment_id": "18073576745526689",
            "pk": "18104612041708229",
            "private_reply_status": 0,
            "replied_to_comment_id": "18073576745526689",
            "restricted_status": 0,
            "share_enabled": true,
            "status": "Active",
            "strong_id__": "18104612041708229",
            "text": "@cathy.chen.0317 那是我命中注定的夢中情棍😌",
            "type": 2,
            "user": {
                "fbid_v2": "17841411022248072",
                "full_name": "Evian Chen",
                "has_onboarded_to_text_post_app": true,
                "id": "10864583408",
                "is_mentionable": true,
                "is_private": false,
                "is_verified": false,
                "latest_reel_media": 1772202277,
                "pk": "10864583408",
                "pk_id": "10864583408",
                "profile_pic_id": "3836760041400221668_10864583408",
                "profile_pic_url": "https://scontent.cdninstagram.com/v/t51.82787-19/634409242_18184300927367409_5028648989152821044_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=110&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=QQHXCaRvLkAQ7kNvwGMJU_R&_nc_oc=AdlKH7PQU39oiRDIuM5NFN3HSSaW6gJDhhHwzke1rFfV8MDWx6CvnaFjCIruaExY1bQ&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=5JOINsKRE25LECxMlAhetQ&_nc_ss=8&oh=00_Afv_bw1nxExBHJ6mkVA8MRDaW4yV0z7R-uaUtzrrch8IEg&oe=69A813A7",
                "strong_id__": "10864583408",
                "username": "paramecium_domain"
            },
            "fallback_user_info": {
                "id": "10864583408"
            },
            "user_id": "10864583408"
        }
    ],
    "has_more_head_child_comments": false,
    "has_more_tail_child_comments": false,
    "is_ranked_replies": false,
    "liked_by_media_owner_badge_enabled": true,
    "parent_comment": {
        "bit_flags": 0,
        "comment_like_count": 0,
        "content_type": "comment",
        "created_at": 1767113384,
        "created_at_for_fb_app": 1767113384,
        "created_at_utc": 1767113384,
        "did_report_as_spam": false,
        "has_disliked_comment": false,
        "has_liked_comment": false,
        "is_covered": false,
        "is_photo_comments_enabled_for_comment_author": false,
        "is_text_editable": false,
        "is_edited": false,
        "is_ranked_comment": false,
        "liked_by_media_coauthors": [],
        "media_id": "3799066249843054737",
        "pk": "18073576745526689",
        "private_reply_status": 0,
        "restricted_status": 0,
        "share_enabled": true,
        "status": "Active",
        "strong_id__": "18073576745526689",
        "text": "那根木棍完美到限動出現一次貼文再出現一次😍😍",
        "type": 0,
        "user": {
            "fbid_v2": "17841410567119797",
            "full_name": "Cathy  Chen",
            "id": "10638376237",
            "is_mentionable": true,
            "is_private": true,
            "is_verified": false,
            "latest_reel_media": 1772201928,
            "pk": "10638376237",
            "pk_id": "10638376237",
            "profile_pic_id": "3786853120870660142_10638376237",
            "profile_pic_url": "https://scontent.cdninstagram.com/v/t51.82787-19/599416935_18185866795352238_6236340326190931431_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=108&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=TR8YVwsIyUcQ7kNvwELC387&_nc_oc=Adn6nYYQ-dYG4fr2to3EczGsfggLjZknIWFRlTckfCSMcUcRdELtOxdArddjH09fYSU&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_gid=5JOINsKRE25LECxMlAhetQ&_nc_ss=8&oh=00_Afu3LUEg4OYnVJwPkVwRFMkdOFR8FNxtViXTjDsD2WoY5w&oe=69A836AD",
            "strong_id__": "10638376237",
            "username": "cathy.chen.0317"
        },
        "fallback_user_info": {
            "id": "10638376237"
        },
        "user_id": "10638376237"
    },
    "status": "ok"
}
*/