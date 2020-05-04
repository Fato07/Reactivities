using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using Domain;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Application
{
    public class ActivityDTO
    {
        public Guid ActivityId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public ICollection<AttendeeDTO> UserActivities { get; set; }
    }
}