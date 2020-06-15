using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactOnboard.Models
{
    public class Product
    {
        [Key]
        public int ProductID { get; set; }
        [Required(ErrorMessage = "This is required name")]

        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Product Price is required")]
        public decimal Price { get; set; }
        public List<Sales> ProductSold { get; set; }

    }
}
