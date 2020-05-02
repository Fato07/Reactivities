using System;
using System.Collections.Generic;
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
        
        [JsonProperty(PropertyName = "Attendees")]
        public ICollection<AttendeeDTO> UserActivities { get; set; }
    }
}