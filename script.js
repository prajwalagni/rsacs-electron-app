/* ================== HEADER ================== */

// Add an event listener to the search input for key press or search functionality
document.querySelector('.search-input').addEventListener('input', function(e) {
    console.log('Searching:', e.target.value);
});


/* ================== LINK ACTIVE ================== */
const linkColor = document.querySelectorAll('.nav__link');
// const linkColor = document.querySelectorAll('.nav__link')

function colorLink() {
    linkColor.forEach(l => l.classList.remove('active-link'))
    this.classList.add('active-link')
}

// function dynamicContent() {
//     linkColor.forEach(l => l.classList.remove('active-link'))
//     this.classList.add('active-link')
// }

linkColor.forEach(l => l.addEventListener('click', colorLink))

/* ================== SHOW HIDDEN MENU ================== */
const showMenu = (toggleId, navbarId) => {
    const toggle = document.getElementById(toggleId)
    const navbar = document.getElementById(navbarId)

    if (toggle && navbar) {
        toggle.addEventListener('click', () => {
            // Show Menu
            navbar.classList.toggle('show-menu')

            // Rotate toggle icon
            toggle.classList.toggle('rotate-icon')

            document.getElementsByClassName('header-container')[0].classList.toggle('nav-open');
            document.getElementsByClassName('section')[0].classList.toggle('nav-open');
        })
    }
}
showMenu('nav-toggle', 'nav')

/* ================== PO FORM ================== */
const po_mainPage = document.getElementsByClassName('po-menu-container')[0];
const create_po_form_btn = document.getElementsByClassName('po-container')[0];
const view_po_page = document.getElementsByClassName('po-container')[1];
const settings_mainPage = document.getElementsByClassName('po-menu-container')[1];

let locations = [
    {
        href: "create-po-form",
        name: "Create PO",
        description: "Generate a new purchase order",
        redirect: () => {
            window.history.pushState(null, null, "create-po-form");
            po_mainPage.style.display = "none";
            create_po_form_btn.style.display = "block";
        }
    },
    {
        href: "create-po",
        name: "Create PO",
        description: "Generate a new purchase order",
        redirect: () => {
            history.back();
            po_mainPage.style.display = "flex";
            create_po_form_btn.style.display = "none";
        }
    },
    {
        href: "view-po",
        name: "View PO",
        description: "Display existing purchase orders",
        redirect: () => {
            window.history.pushState(null, null, "view-po");
            po_mainPage.style.display = "none";
            view_po_page.style.display = "block";
        }
    },
    {
        href: "settings",
        name: "Settings",
        description: "Settings desc",
        redirect: () => {
            window.history.pushState(null, null, "settings");
            po_mainPage.style.display = "none";
            settings_mainPage.style.display = "flex";
            document.querySelector("main > h1").style.display = "none";
        }
    },
    {
        href: "main-page",
        name: "Main Page",
        description: "Main page desc",
        redirect: () => {
            window.history.pushState(null, null, "index.html");
            po_mainPage.style.display = "flex";
            settings_mainPage.style.display = "none";
            document.querySelector("main > h1").style.display = "block";
            window.electronAPI.sendNotification("Test Title", "Testing body");
        }
    }
]

const date = new Date();
document.getElementById('date').value = date.toISOString().substr(0, 10);
document.getElementById('date2').value = date.toISOString().substr(0, 10);
const create_po_btn = document.getElementsByClassName('po-menu-card')[0];
const view_po_btn = document.getElementsByClassName('po-menu-card')[1];
create_po_btn.addEventListener('click', locations[0].redirect);
view_po_btn.addEventListener('click', locations[2].redirect);
linkColor[0].addEventListener('click', locations[4].redirect);
linkColor[4].addEventListener('click', locations[3].redirect);

const addRowBtn = document.getElementById('po-add-row');
const orderItems = document.getElementById('po-order-items');
const totalAmountSpan = document.getElementById('po-total-amount');
let totalAmount = 0;

addRowBtn.addEventListener('click', addRow);

function addRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="po-td"><input type="text" class="po-input po-product-name" placeholder="Product Name"></td>
        <td class="po-td"><input type="number" class="po-input po-quantity" placeholder="Quantity" value="1" min="1" onclick="this.select()"></td>
        <td class="po-td"><input type="number" class="po-input po-unit-price" placeholder="Unit Price" value="0" min="0" onclick="this.select()"></td>
        <td class="po-td">&#8377;<span class="po-row-total">0</span></td>
        <td class="po-td"><button class="po-btn po-btn-danger" onclick="deleteRow(this)">Delete</button></td>
    `;

    orderItems.appendChild(tr);

    const quantityInput = tr.querySelector('.po-quantity');
    const unitPriceInput = tr.querySelector('.po-unit-price');
    const rowTotalSpan = tr.querySelector('.po-row-total');

    quantityInput.addEventListener('input', () => updateRowTotal(tr));
    unitPriceInput.addEventListener('input', () => updateRowTotal(tr));

    updateTotalAmount();
}

function updateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('.po-quantity').value);
    const unitPrice = parseFloat(row.querySelector('.po-unit-price').value);
    const rowTotal = quantity * unitPrice;

    row.querySelector('.po-row-total').textContent = rowTotal.toFixed(2);
    updateTotalAmount();
}

function updateTotalAmount() {
    totalAmount = 0;
    document.querySelectorAll('.po-row-total').forEach(rowTotalSpan => {
        totalAmount += parseFloat(rowTotalSpan.textContent);
    });
    totalAmountSpan.textContent = totalAmount.toFixed(2);
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.remove();
    updateTotalAmount();
}

document.getElementsByClassName('po-cancel-btn')[0].addEventListener('click', function() {
    if (confirm("Are you sure? Changes may not be saved.") == true) {
        // Clear the form inputs
        const inputs = document.querySelectorAll(".po-input");
        inputs.forEach(input => {
            if (input.type === "text" || input.type === "number" || input.type === "date") {
                input.value = ""; // Clear the value
            } else if (input.tagName.toLowerCase() === "select") {
                input.selectedIndex = 0; // Reset select field
            }
        });

        // Clear all dynamically added rows in the table (except the header row)
        const tableBody = document.querySelector('#po-order-items');

        // Clear all rows from the tbody
        while (tableBody.rows.length > 0) {
            tableBody.deleteRow(0);
        }
    }
    else {
        setTimeout(() => {
            locations[0].redirect();
        }, 0.5);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    const versionElement = document.querySelector(".sett-bottom > span"); // Use querySelector for single element
    const version = await window.electronAPI.getAppVersion(); // Await the version response
    versionElement.textContent = "App Version: " + version;
});

window.addEventListener('popstate', function(event) {
    event.preventDefault();
    po_mainPage.style.display = "flex";
    create_po_form_btn.style.display = "none";
    view_po_page.style.display = "none";
    settings_mainPage.style.display = "none";
});