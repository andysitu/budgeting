using System.ComponentModel.DataAnnotations;
using Budgeting.Models;

namespace Budgeting.Models{
    public class Username
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        [DataType(DataType.EmailAddress)]
        public string? Email { get; set; }
    }
}