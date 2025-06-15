document.addEventListener('DOMContentLoaded', function() {
    
    const products = {
        "fshirt": {
            id: "fshirt",
            name: "足球T恤",
            price: 25,
            image: "images/Men/fshirt1.jpeg",
            category: "Men"
        },
        "ghoodie": {
            id: "ghoodie",
            name: "黑色查普曼大学连帽衫",
            price: 15,
            image: "images/Men/ghoodie1.jpeg",
            category: "Men"
        },
        "boots1": {
            id: "boots1",
            name: "女士黑色短靴",
            price: 30,
            image: "images/Women/boots1.jpeg",
            category: "Women"
        },
        "bshort": {
            id: "bshort",
            name: "黑色牛仔短裤",
            price: 10,
            image: "images/Women/bshort1.jpeg",
            category: "Women"
        },
        "pull": {
            id: "pull",
            name: "多色拼接连帽外套",
            price: 20,
            image: "images/Women/pull1.jpeg",
            category: "Women"
        },

        "gsweater": {
            id: "gsweater",
            name: "灰色运动卫衣",
            price: 35,
            image: "images/Men/gsweater1.jpeg",
            category: "Men"
        },
        "cshoes": {
            id: "cshoes",
            name: "黑色皮鞋",
            price: 25,
            image: "images/Women/classic-shoes1.jpeg",
            category: "Women"
        },
        "pants": {
            id: "pants",
            name: "黑色长裤子",
            price: 22,
            image: "images/Men/pants1.jpeg",
            category: "Men"
        },
        "hoodie": {
            id: "hoodie",
            name: "灰色连帽衫",
            price: 35,
            image: "images/Men/hoodie1.jpeg",
            category: "Men"
        },
        "polo": {
            id: "polo",
            name: "粉色马球衫",
            price: 15,
            image: "images/Men/polo1.jpeg",
            category: "Men"
        },
        "sportwear": {
            id: "sportwear",
            name: "运动衣",
            price: 20,
            image: "images/Women/sportwear1.jpeg",
            category: "Women"
        },
         "gsweaterf": {
            id: "gsweaterf",
            name: "灰色外套",
            price: 45,
            image: "images/Women/gsweater1.jpeg",
            category: "Women"
        },
        


    };

    
    function initializeSorting() {
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', sortProducts);
        }
        
        
        document.querySelectorAll('.col-3').forEach(productEl => {
            const imgSrc = productEl.querySelector('img').src.split('/').pop();
            const productId = Object.keys(products).find(key => 
                products[key].image.endsWith(imgSrc)
            );
            if (productId) {
                productEl.dataset.productId = productId;
            }
        });
    }

    
    function sortProducts() {
        const sortOption = document.getElementById('sort-by').value;
        const allProducts = Array.from(document.querySelectorAll('.col-3[data-product-id]'));
        
        allProducts.sort((a, b) => {
            const productA = products[a.dataset.productId];
            const productB = products[b.dataset.productId];
            
            if (!productA || !productB) return 0;
            
            switch(sortOption) {
                case 'price-asc':
                    return productA.price - productB.price;
                case 'price-desc':
                    return productB.price - productA.price;
                case 'name-asc':
                    return productA.name.localeCompare(productB.name);
                case 'men':
                    if (productA.category === 'Men' && productB.category !== 'Men') return -1;
                    if (productA.category !== 'Men' && productB.category === 'Men') return 1;
                    return 0;
                case 'women':
                    if (productA.category === 'Women' && productB.category !== 'Women') return -1;
                    if (productA.category !== 'Women' && productB.category === 'Women') return 1;
                    return 0;
                default:
                    return 0;
            }
        });
        
        const rowContainers = document.querySelectorAll('.small-container .row:not(.row-2)');
        
        
        rowContainers.forEach(row => {
            while (row.firstChild) {
                row.removeChild(row.firstChild);
            }
        });
        
        
        allProducts.forEach((product, index) => {
            const targetRow = rowContainers[Math.floor(index / 4)] || rowContainers[0];
            targetRow.appendChild(product);
        });
    }

    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        }
    }
    updateCartCount();

    
    window.addToCart = function(productId, quantity = 1) {
        if (!products[productId]) {
            console.error("Product not found:", productId);
            return false;
        }

        const product = products[productId];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItemIndex = cart.findIndex(item => 
            String(item.id).trim().toLowerCase() === String(productId).trim().toLowerCase()
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
            const button = document.querySelector(`[data-add-to-cart="${productId}"]`);
            if (button) {
                const originalText = button.getAttribute('data-original-text') || "Add to Cart";
                button.textContent = `✓  已加购 (${cart[existingItemIndex].quantity})`;
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }
        } else {
            cart.push({
                ...product,
                id: productId,
                quantity: quantity
            });
            
            const button = document.querySelector(`[data-add-to-cart="${productId}"]`);
            if (button) {
                button.textContent = "✓ 已加入购物车!";
                setTimeout(() => {
                    button.textContent = button.getAttribute('data-original-text') || "Add to Cart";
                }, 2000);
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        return true;
    };

    
    function attachCartListeners() {
        document.querySelectorAll('[data-add-to-cart]').forEach(button => {
            if (!button.hasAttribute('data-original-text')) {
                button.setAttribute('data-original-text', button.textContent);
            }
            
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-add-to-cart');
                const quantity = parseInt(this.getAttribute('data-quantity')) || 1;
                window.addToCart(productId, quantity);
            });
        });
    }

    
    window.menutoggle = function() {
        const menuItems = document.getElementById('MenuItems');
        menuItems.style.maxHeight = menuItems.style.maxHeight === "0px" ? "200px" : "0px";
    };

    
    function initializeImageClicks() {
        
        const ProductImg = document.getElementById("ProductImg");
        if (ProductImg) {
            document.querySelectorAll('.small-img').forEach(img => {
                img.addEventListener('click', () => {
                    ProductImg.src = img.src;
                });
            });
        }
        
        
        document.querySelectorAll('.col-3').forEach(product => {
            const link = product.querySelector('a');
            if (link) {
                product.style.cursor = 'pointer';
                product.addEventListener('click', (e) => {
                    
                    if (!e.target.closest('button') && !e.target.classList.contains('small-img')) {
                        link.click();
                    }
                });
            }
        });
    }
    initializeSorting();
    attachCartListeners();
    initializeImageClicks();
});