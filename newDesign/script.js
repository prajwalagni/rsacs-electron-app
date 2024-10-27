window.addEventListener('DOMContentLoaded', async () => {
    const version = await window.electronAPI.getAppVersion(); // Await the version response
    console.log('App version:', version);

    // Append the version to the home page
    pages.home.content = `
        <p>This is the home page of our simple SPA.</p>
        <p>App version: ${version}</p>
    `;

    // Load the initial page (e.g., 'home')
    loadPage('home');
});

/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) =>{
    const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId)
    
    // Validate that variables exist
    if(headerToggle && navbarId){
        toggleBtn.addEventListener('click', ()=>{
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
            // change icon
            toggleBtn.classList.toggle('bx-x')
        })
    }
}
showMenu('header-toggle','navbar')

/*==================== LINK ACTIVE ====================*/
const links = document.querySelectorAll('.nav__link')

// Object containing page content for each "page"
const pages = {
    home: {
        title: 'Welcome to the Home Page',
        content: `
        <p>This is the home page of our simple SPA.</p>
        <p>App version: </p> <!-- Version will be appended after DOM is loaded -->
        `
    },
    cal_details_entry: {
        title: 'Calibration Details Entry',
        content: `
            <div class="po-container">
                <h2 class="po-h2">Calibration Entry Form</h2>
                
                <!-- Dropdown for Seller Contact -->
                <!-- <label class="po-label" for="po-seller-contact">Seller Contact:</label>
                <select class="po-input" id="po-seller-contact" required>
                    <option value="" disabled selected>Select a customer</option>
                    <option value="Customer 1">Customer 1</option>
                    <option value="Customer 2">Customer 2</option>
                    <option value="Customer 3">Customer 3</option>
                    <option value="Customer 4">Customer 4</option>
                    <option value="Customer 5">Customer 5</option>
                </select> -->
            
                <!-- Disabled inputs -->
                <div class="po-grid">
                    <div>
                        <label class="po-label" for="txt_split">Enter excel data:</label>
                        <input class="po-input" type="text" id="txt_split">
                    </div>

                    <div>
                        <label class="po-label" for="dummy">Dummy:</label>
                        <input class="po-input" type="text" id="dummy" placeholder="DUMMY" disabled>
                    </div>

                    <div>
                        <label class="po-label" for="sl_no">Sl. No:</label>
                        <input class="po-input" type="number" id="sl_no" required>
                    </div>
            
                    <div>
                        <label class="po-label" for="eqp_name">Equipment Name:</label>
                        <input class="po-input" type="text" id="eqp_name" required>
                    </div>
            
                    <div>
                        <label class="po-label" for="cust_name">Company Name:</label>
                        <input class="po-input" type="text" id="cust_name" required>
                    </div>

                    <div>
                        <label class="po-label" for="city">City:</label>
                        <input class="po-input" type="text" id="city" required>
                    </div>
            
                    <div>
                        <label class="po-label" for="eqp_sl_no">* Equipment Sl. No:</label>
                        <input class="po-input" type="text" id="eqp_sl_no" required>
                    </div>
            
                    <div>
                        <label class="po-label" for="cal_std">Calibration Standard:</label>
                        <input class="po-input" type="text" id="cal_std" required>
                    </div>
            
                    <!-- <div>
                        <label class="po-label" for="date">Calibrated On:</label>
                        <input class="po-input" type="date" id="date" disabled>
                    </div> -->
                </div>
            
                <!-- Editable inputs -->
                <div class="po-editables">
                    <!-- <div>
                        <label class="po-label" for="po-number">PO Number:</label>
                        <input class="po-input" type="text" id="po-number" placeholder="Enter PO Number">
                    </div> -->

                    <div>
                        <label class="po-label" for="cal_date">Calibrated On:</label>
                        <input class="po-input" type="date" id="cal_date" required>
                    </div>
            
                    <div>
                        <label class="po-label" for="cal_due_date">Calibration Due:</label>
                        <input class="po-input" type="date" id="cal_due_date" required>
                    </div>
                </div>
            
                <!-- <button class="po-btn" id="po-add-row">Add Row</button> -->
            
                <table class="po-table">
                    <thead>
                    <tr>
                        <th class="po-th">Sl. No</th>
                        <th class="po-th">Equipment Name</th>
                        <th class="po-th">Company Name</th>
                        <th class="po-th">City</th>
                        <th class="po-th">Equipment Sl. No</th>
                        <th class="po-th">Calibration Standard</th>
                        <th class="po-th">Calibrated On</th>
                        <th class="po-th">Calibration Due</th>
                        <th class="po-th">Action</th>
                    </tr>
                    </thead>
                    <tbody id="po-order-items">
                    <!-- Rows will be added here dynamically -->
                    </tbody>
                </table>
            
                <!-- <div class="po-total-amount">Total Amount: &#8377;<span id="po-total-amount">0</span></div> -->
            
                <div class="po-actions">
                    <button class="po-btn po-btn-danger po-cancel-btn" onclick="document.querySelector('[data-link=home]').click()">Cancel</button>
                    <button class="po-btn" onclick="cal_entry_fn()">Submit</button>
                </div>
            </div>
        `
    }
    // contact: {
    //     title: 'Contact Us',
    //     content: '<p>You can contact us at contact@example.com.</p>'
    // }
};

const contentDiv = document.getElementsByClassName('main_content')[0];

let txt_split;
let txt_splitted;

async function cal_details_sqldata() {
    let sql_res = await window.electronAPI.get_cal_details_sqldata();
    console.log(sql_res);
    const sql_res_table = document.getElementById('po-order-items');
    sql_res_table.innerHTML = '';
    for (let n = 0; n < sql_res.length; n++) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="po-td">${sql_res[n].sl_no}</td>
            <td class="po-td">${sql_res[n].eqp_name}</td>
            <td class="po-td">${sql_res[n].cust_name}</td>
            <td class="po-td">${sql_res[n].city}</td>
            <td class="po-td">${sql_res[n].eqp_sl_no}</td>
            <td class="po-td">${sql_res[n].cal_std}</td>
            <td class="po-td">${sql_res[n].cal_date.toISOString().split('T')[0]}</td>
            <td class="po-td">${sql_res[n].cal_due_date.toISOString().split('T')[0]}</td>
            <td class="po-td"><button class="po-btn po-btn-danger" onclick="deleteRow(this)">Delete</button></td>
        `;
    
        sql_res_table.appendChild(tr);
        
    }
    
}

// cal_details_sqldata();

// Function to render page content based on the link clicked
async function loadPage(page) {
    // const upcCals = await window.electronAPI.upcCals(); // Await the upcCals response
    // console.log(upcCals);
    contentDiv.innerHTML = `
        <h1>${pages[page].title}</h1>
        ${pages[page].content}
    `;

    // Update active link class
    links.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-link="${page}"]`).classList.add('active');
    if (page == 'cal_details_entry') {
        var sl_no = document.querySelector("#sl_no");
        var eqp_name = document.querySelector("#eqp_name");
        var cust_name = document.querySelector("#cust_name");
        var city = document.querySelector("#city");
        var eqp_sl_no = document.querySelector("#eqp_sl_no");
        var cal_std = document.querySelector("#cal_std");
        var cal_date = document.querySelector("#cal_date");
        var cal_due_date = document.querySelector("#cal_due_date");
        txt_split = document.querySelector("#txt_split");
        cal_details_sqldata();
        console.log(txt_split);
        txt_split.addEventListener('input', (e) => {
            txt_splitted = e.target.value.split("\t");
            console.log(txt_splitted);
            [sl_no.value, eqp_name.value, cust_name.value, city.value, eqp_sl_no.value, cal_std.value, cal_date.value, cal_due_date.value] = txt_splitted;
            console.log(sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date);
            e.target.value = '';
            if (!eqp_sl_no.value) {
                eqp_sl_no.style.border = "2px solid red";
                setTimeout(() => {
                    alert("Please fill all the required fields.");
                }, 100);
                eqp_sl_no.addEventListener('input', (e) => {
                    e.style.border = "";
                });
            }
        });
    }
}

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const page = link.getAttribute('data-link');
        console.log(page);
        loadPage(page);

    });
});

// const cal_entry_submit_btn = document.querySelector(".po-actions > button:nth-child(2)");

async function cal_entry_fn() {
    // let txt_split = document.querySelector("#txt_split").value;
    // let txt_splitted;
    sl_no = document.querySelector("#sl_no").value;
    eqp_name = document.querySelector("#eqp_name").value;
    cust_name = document.querySelector("#cust_name").value;
    city = document.querySelector("#city").value;
    eqp_sl_no = document.querySelector("#eqp_sl_no").value;
    cal_std = document.querySelector("#cal_std").value;
    cal_date = document.querySelector("#cal_date").value;
    cal_due_date = document.querySelector("#cal_due_date").value;
    console.log(sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date);
    // [sl_no, eqp_name, cust_name, eqp_sl_no, cal_std, cal_date, cal_due_date] = txt_splitted;
    // console.log(sl_no, eqp_name, cust_name, eqp_sl_no, cal_std, cal_date, cal_due_date);

    // if (txt_split) {
    //     txt_splitted = txt_split.split("\t");
    //     console.log(txt_splitted);
    // }

    if (!eqp_sl_no) {
        document.querySelector("#eqp_sl_no").style.border = "2px solid red";
        setTimeout(() => {
            alert("Please fill all the required fields.");
        }, 100);
        document.querySelector("#eqp_sl_no").addEventListener('input', (e) => {
            e.style.border = "";
        });
    } else {
        let res = await window.electronAPI.cal_entry(sl_no, eqp_name, cust_name, city, eqp_sl_no, cal_std, cal_date, cal_due_date);
        console.log(res);
        if (res) {
            console.log("Cal entry done");
    
            sl_no = document.querySelector("#sl_no").value = '';
            eqp_name = document.querySelector("#eqp_name").value = '';
            cust_name = document.querySelector("#cust_name").value = '';
            city = document.querySelector("#city").value = '';
            eqp_sl_no = document.querySelector("#eqp_sl_no").value = '';
            cal_std = document.querySelector("#cal_std").value = '';
            cal_date = document.querySelector("#cal_date").value = '';
            cal_due_date = document.querySelector("#cal_due_date").value = '';   
        }
    
        cal_details_sqldata();   
    }
}

async function deleteRow(button) {
    const row = button.parentNode.parentNode;
    console.log(row.children[0].innerText);
    if (confirm(`Are you sure to delete Sl.No. ${row.children[0].innerText}?`)) {
        let res = await window.electronAPI.cal_rm_entry(row.children[0].innerText);
        console.log(res);
        row.remove();
    }
}

async function remDays() {
    let sql_res = await window.electronAPI.get_cal_details_sqldata();
    console.log(sql_res);
    for (let n = 0; n < sql_res.length; n++) {
        let date1 = new Date();
        let date2 = sql_res[n].cal_due_date;

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
        const diffDays = Math.ceil((date2 - date1) / oneDay);
        // console.log(sql_res[n].sl_no, "diff: ", diffDays);

        if (diffDays < 15) {
            let message = `
                <b>ONLY ${diffDays} DAYS REMAINING !!</b>

    <b>Sl.No:</b>   ${sql_res[n].sl_no}
    <b>Equipment Name:</b>   ${sql_res[n].eqp_name}
    <b>Company Name:</b>   ${sql_res[n].cust_name}
    <b>City:</b>   ${sql_res[n].city}
    <b>Equipment Sl.No:</b>   ${sql_res[n].eqp_sl_no}
    <b>Calibration Standard:</b>   ${sql_res[n].cal_std}
    <b>Calibration Date:</b>   ${sql_res[n].cal_date.toISOString().split('T')[0]}
    <b>Calibration Due Date:</b>   ${sql_res[n].cal_due_date.toISOString().split('T')[0]}
            `
            let res = await window.electronAPI.send_tg_msg(message);
        }
        
    }
}

// Listen for the call from main process
// window.electronAPI.sendTelegramMessage = async (message) => {
//     remDays();
// };
