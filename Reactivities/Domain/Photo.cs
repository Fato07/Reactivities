using System;

namespace Domain
{
    public class Photo
    {
        public Guid Id { get; set; }
        public string ImageUrl { get; set; }
        public bool IsMain { get; set; }
    }
}