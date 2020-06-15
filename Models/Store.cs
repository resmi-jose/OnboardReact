using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactOnboard.Models
{
    public class Store
    {
        [Key]
        [ScaffoldColumn(false)]
        public int StoreID { get; set; }
        [Required(ErrorMessage = "This is required name")]

        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }
        [Required(ErrorMessage = "This is required field")]
        [Column(TypeName = "nvarchar(100)")]
        public string Address { get; set; }
        public List<Sales> ProductSold { get; set; }

    }
}
