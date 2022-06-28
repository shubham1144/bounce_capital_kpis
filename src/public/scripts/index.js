/******************************************************************************
 *                          Fetch and display kpis
 ******************************************************************************/

displayKpis();


function displayKpis() {
    httpGet('/api/kpis/all')
        .then(response => response.json())
        .then((response) => {
            var allKpis = response.kpis;
            // Empty the anchor
            var allKpisAnchor = document.getElementById('all-kpis-anchor');
            allKpisAnchor.innerHTML = '';
            // Append kpis to anchor
            allKpis.forEach((kpi) => {
                allKpisAnchor.innerHTML += getKpiDisplayEle(kpi);
            });
        });
};


function getKpiDisplayEle(kpi) {
    return `<div class="kpi-display-ele">

        <div class="normal-view">
            <div>Name: ${kpi.kpiName}</div>
            <div>Value: ${kpi.kpiValue}</div>
            <button class="edit-kpi-btn" data-kpi-id="${kpi.id}">
                Edit
            </button>
        </div>
        
        <div class="edit-view">
            <div>
                Name: <input class="name-edit-input" value="${kpi.kpiName}">
            </div>
            <div>
                Value: <input class="value-edit-input" value="${kpi.kpiValue}">
            </div>
            <button class="submit-edit-btn" data-kpi-id="${kpi.id}">
                Submit
            </button>
            <button class="cancel-edit-btn" data-kpi-id="${kpi.id}">
                Cancel
            </button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Kpis
 ******************************************************************************/

document.addEventListener('click', function (event) {
    event.preventDefault();
    var ele = event.target;
    if (ele.matches('#add-kpi-btn')) {
        addKpi();
    } else if (ele.matches('.edit-kpi-btn')) {
        showEditView(ele.parentNode.parentNode);
    } else if (ele.matches('.cancel-edit-btn')) {
        cancelEdit(ele.parentNode.parentNode);
    } else if (ele.matches('.submit-edit-btn')) {
        submitEdit(ele);
    }
}, false)


function addKpi() {
    var nameInput = document.getElementById('name-input');
    var valueInput = document.getElementById('value-input');
    var data = {
        kpi: {
            kpiName: nameInput.value,
            kpiValue: valueInput.value
        },
    };
    httpPost('/api/kpis/add', data)
        .then(() => {
            displayKpis();
        })
}


function showEditView(kpiEle) {
    var normalView = kpiEle.getElementsByClassName('normal-view')[0];
    var editView = kpiEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit(kpiEle) {
    var normalView = kpiEle.getElementsByClassName('normal-view')[0];
    var editView = kpiEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit(ele) {
    var kpiEle = ele.parentNode.parentNode;
    var nameInput = kpiEle.getElementsByClassName('name-edit-input')[0];
    var valueInput = kpiEle.getElementsByClassName('value-edit-input')[0];
    var id = ele.getAttribute('data-kpi-id');
    var data = {
        kpi: {
            kpiName: nameInput.value,
            kpiValue: valueInput.value,
            id: Number(id),
        },
    };
	httpPut('/api/kpis/update', data)
        .then(() => {
            displayKpis();
        })
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function getOptions(verb, data) {
    var options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}

