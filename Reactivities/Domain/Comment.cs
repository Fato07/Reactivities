using System;
using Domain.Identity;

namespace Domain
{
    public class Comment
    {
        public Guid CommentId { get; set; }
        public string Body { get; set; }
        public virtual AppUser Author { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}