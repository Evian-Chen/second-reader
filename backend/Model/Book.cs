using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Enums;

namespace backend.Model
{
    [Table("Book")]
    public class Book
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        [MaxLength(50)]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string ISBN { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public BookCategory BookCategory { get; set; }
    }
}