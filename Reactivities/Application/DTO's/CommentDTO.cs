using System;
using Domain;
using Domain.Identity;

namespace Application
{
    public class CommentDTO
    {
        public Guid CommentId { get; set; }
        public string Body { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string ImageUrl { get; set; }
    }
}