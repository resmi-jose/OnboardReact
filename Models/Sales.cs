using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ReactOnboard.Models
{
    public class Sales
    {
        [Key]
        [ScaffoldColumn(false)]
        public int SalesID { get; set; }
        [Required(ErrorMessage = "Product ID is required")]
        public int productid { get; set; }
        [Required(ErrorMessage = "Customer ID is required")]
        public int customerid { get; set; }
        [Required(ErrorMessage = "Store ID is required")]
        public int storeid { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        [Required(ErrorMessage = "Date Sold is required")]

        public DateTime DateSold { get; set; }
        public Customer customer { get; set; }
        public Product product { get; set; }
        public Store store { get; set; }
    }
}
