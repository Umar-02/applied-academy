// Put your application javascript here
var formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

// CART DRAWER

function openCartDrawer() {
  document.querySelector(".cart-drawer").classList.remove("hidden")
}

function closeCartDrawer() {
  document.querySelector(".cart-drawer").classList.add("hidden")
}

async function updateCart() {
  const res = await fetch("/?section_id=cart-drawer")
  const text = await res.text()
  const html = document.createElement("div")
  html.innerHTML = text

  const newBox = html.querySelector('.cart-drawer').innerHTML

  document.querySelector('.cart-drawer').innerHTML = newBox
  addCartDrawerListeners()

}

function updateCartItemCount(count) {
  document.querySelectorAll('.cart-items-count').forEach((el) => {
    el.textContent = count
  })
}

function addCartDrawerListeners() {
  document.querySelectorAll(".cart-drawer-quantity-selector button").forEach((button) => {
    button.addEventListener("click", async () => {
      const rootItem = button.parentElement.parentElement.parentElement

      const key = rootItem.getAttribute('data-line-item-key')

      const currentQuantity = Number(button.parentElement.querySelector('input').value)
      const isUp = button.classList.contains('cart-drawer-add--quantity')
      
      const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1
      
      
      const res = await fetch('/cart/update.js', {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify( {updates: {[key]: newQuantity } })
      })
      
      const cart = await res.json()
      console.log(res);

      updateCartItemCount(cart.item_count)

      updateCart()
    })
  })

  document.querySelector(".cart-drawer-box").addEventListener("click", (e) => {
    e.stopPropagation()
  })

  document.querySelectorAll(".cart-drawer-close, .cart-drawer").forEach((el) => {
    el.addEventListener("click", () => {
      closeCartDrawer()
    })
  })

}

document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    fetch("/cart/add", {
      method: 'post',
      body: new FormData(form)
    })

    const res = await fetch('/cart.js')
    const cart  = await res.json()
    updateCartItemCount(cart.item_count)

    await updateCart()
    openCartDrawer()
  })
});

document.querySelectorAll("a[href='/cart']").forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault()
    openCartDrawer()
  })
})

addCartDrawerListeners()

