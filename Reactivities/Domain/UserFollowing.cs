using System;
using Domain.Identity;

namespace Domain
{
    public class UserFollowing
    {
        public Guid ObserverId { get; set; }
        //public virtual AppUser Observer { get; set; }
        public Guid TargetId { get; set; }
        //public virtual AppUser Target { get; set; }
    }
}