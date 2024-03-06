const main = document.getElementById('main');
const menuBtn = document.getElementById("menu-btn");
const menuSmallScreen = document.getElementById("menuSmallScreen");
const menuBigScreen = document.getElementById("menuBigScreen");
var cartItems = [];

function addMenu() {
  // učitavanje menija
  $.ajax({
    url: 'assets/data/menu.json',
    type: 'GET',
    dataType: 'json',
    success: function(menu) {
      if ($(window).width() < 1024) {
        menu.pages.forEach((pages) => {
          const li = document.createElement("li");
          const button = document.createElement("button");
          button.textContent = pages.title;
          button.id = pages.page;
          button.addEventListener("click", loadPage);
          li.appendChild(button);
          menuSmallScreen.appendChild(li);
        });
        menuBtn.style.display = "block";
      } else {
        menu.pages.forEach((pages) => {
          const li = document.createElement("li");
          const button = document.createElement("button");
          button.textContent = pages.title;
          button.id = pages.page;
          button.addEventListener("click", loadPage);
          li.appendChild(button);
          menuBigScreen.appendChild(li);
        });
        menuBtn.style.display = "none";
      }
    },
    error: function(xhr, status, error) {
      console.log(error);
    }
  });
}

// dodavanje event listenera na dugme za prikazivanje padajuće liste
menuBtn.addEventListener("click", () => {
  menuSmallScreen.classList.toggle("show");
});

function addProducts() {
    $.ajax({
      url: 'assets/data/products.json',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        var items = "";
        data.items.forEach((item) => {
          items += "<article class='product'>" +
            "<div class='img-container'>" +
            "<img src='" + item.img + "' alt='" + item.name + "' class='product-img'/>" +
            "<button class='bag-btn' id=product-'" + item.id + "' onclick='addToCart(" + item.id + ")'>" +
            "<i class='zmdi zmdi-shopping-cart'></i>" +
            "Add to bag" +
            "</button>" +
            "</div>" +
            "<h3>" + item.name + "</h3>" +
            "<h4 class='linethrough'>" + item.price.oldPrice + "RSD" + "</h4>" +
            "<h4 class='newPr'>" + item.price.newPrice + "RSD" +"</h4>" +
            "</article>";
        });
        $('#products-list').html(items);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus + ': ' + errorThrown);
      }
    });
  }
  
  function loadPage(event) {
    var id = event.target.getAttribute("id");
    var pageData = null;
    $.ajax({
      url: 'assets/data/pages.json',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        data.pages.forEach((page) => {
          if (page.id === id) {
            pageData = page;
          }
        });
        if (pageData) {
          var content = " <section id='" + pageData.className + "-page'>" +
            "<div class='section-title'>" +
            "<h2 class='title'>" + pageData.header + "</h2>";
            
          // Dodajemo sliku samo na stranici Autor
          if (id === 'author' && pageData.image) {
            content += "<img src='" + pageData.image + "' alt='" + pageData.header + "' class='author-img' />";
          }
          
          content += "</div>" +
            "<div class='pageTxt'>" + pageData.content + "</div>" +
            "</section> ";
          main.innerHTML = content;
          if (id === 'products') {
            const content = document.createElement("div");
            content.classList.add("products-center");
            content.setAttribute('id', 'products-list');
            document.getElementById(pageData.className + "-page").appendChild(content);
            addProducts();
          }
          
          
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
   
      
    });
  }
  
  // Ucitavanje menija
  addMenu();

  //Cart


  function addCartItems(items){
	  var totalPrice = 0;
	  var content = "";
	  items.forEach((item) => {
		  content+="<div class='cart-item' id=cart-item-"+item.id+">"+
							"<img src='"+item.img+"' alt='"+item.name+"'>"+
							"<div>"+
								"<h4>"+item.name+"</h4>"+
								"<h5>"+item.price.newPrice+"</h5>"+
								"<span class='remove-item' onclick='removeItemFromCart("+item.id+")'>Remove</span>"+
							"</div>"+
							"<div>"+
								"<i class='zmdi zmdi-chevron-up'></i>"+
								"<p class='item-amount'>1</p>"+
								"<i class='zmdi zmdi-chevron-down'></i>"+
							"</div>"+
						"</div>"+
					"</div>";
		  totalPrice+=item.price.newPrice;
	  });
	  content += "  <div class='cart-footer'>"+
						"<h3>Your total: RSD <span class='cart-total'>"+totalPrice+"</span></h3>"+
					"<button class='clear-cart banner-btn' onclick='removeAllItemsFromCart()'>Cleart cart</button>";
	document.getElementById('cart-content').innerHTML = content;
	  
  }
  
  function showCart(){
	document.getElementById("cart-overlay").style.display = 'block';
	document.getElementById("cart").classList.toggle("showCart");
	addCartItems(cartItems);
}

function hideCart(){
	document.getElementById("cart-overlay").style.display = 'none';
	document.getElementById("cart").classList.remove("showCart");
}


function addToCart(id){
	products.items.forEach((item) => {
		if(item.id===id){
			cartItems.push(item);
		}
	});
	document.getElementById('cart-items').innerHTML = cartItems.length;
}

	function removeItemFromCart(id){
		cartItems.forEach((item, i) => {
			if(item.id===id){
				cartItems.splice(i, 1);
				
			}
		});
		addCartItems(cartItems);
		document.getElementById('cart-items').innerHTML = cartItems.length;
	}

	function removeAllItemsFromCart(){
		cartItems = [];
		addCartItems(cartItems);
		document.getElementById('cart-items').innerHTML = cartItems.length;
	}  


document.getElementById("cart-btn").addEventListener("click", showCart);
document.getElementById("close-cart").addEventListener("click", hideCart);

$(document).ready(function() {
  $.ajax({
    url: "assets/data/footerData.json",
    dataType: "json",
    success: function(data) {
      console.log("Podaci uspešno pročitani iz JSON fajla.");
      console.log(data); 

      var logoLink = $("<a>").attr("href", data.logoLink);
      var logoImg = $("<img>").attr("src", "assets/images/logo.png").attr("alt", "My Website Logo");
      logoLink.append(logoImg);

      var sitemapLink = $("<a>").attr("href", data.sitemapLink).text("Sitemap");

      var docsLink = $("<a>").attr("href", data.docsLink).text("Documentation");

      var copyrightText = $("<p>").text(data.copyright);

      $("#footer").append(logoLink).append(" | ").append(sitemapLink).append(" | ").append(docsLink).append("<br>").append(copyrightText);
    },
    error: function(xhr, status, error) {
      console.log("Greška u AJAX pozivu.");
      console.log(xhr.responseText);
    }
  });
});

//NE RADI!!
var btn = $('.banner-btn');

btn.on('click', function() {
  $.ajax({
    url: 'assets/data/pages.json',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      var productsPage = data.pages.find(function(page) {
        return page.id === 'products';
      });
      window.location.href = productsPage.id + '.html';
    },
    error: function(error) {
      console.log('Error:', error);
    }
  });
});



