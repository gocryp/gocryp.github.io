/*global $*/

// Make an AJAX request and add a table with results on a given section.
load_api_table('GET', 'https://gocrypto-api.herokuapp.com/coins', 'fees-table', ['rank', 'ticker', 'binance_fee_usd', 'bittrex_fee_usd', 'poloniex_fee_usd']);


/* Fill a table from an AJAX request on a JSON API
   @method: 'GET'
   @api_url: URL from API to call
   @section_id: Section ID in target DOM
   @keys: List of dictionary keys to print in table
*/
function load_api_table(method, api_url, table_id, keys) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var html = jsonlist2table(this.responseText, keys);
            document.getElementById(table_id).innerHTML = html;
            
            // Adding Bootstrap format table
            custom_format_table('#fees-table');
        }
    };
    xhttp.open(method, api_url, true);
    xhttp.send();
}


/* Converts a JSON-formatted list to a table with given keys */
function jsonlist2table (list, keys) {

    var myObj = JSON.parse(list);
    var html = '<table>';
    
    // Keys
    html += '<thead><tr>';
    for (var i in keys) {
        html += '<th>' + keys[i] + '</th>';
    }
    html += '</tr></thead>';

    // Values
    html += '<tbody>';
    for (var i in myObj) {
        html += '<tr>';
        for (var j in keys) {
            var key = keys[j];
            
            // Adding '$' to dollar fields
            if (j != 0 && j != 1 && myObj[i][key] != null) 
                html += '<td class="usd">' + myObj[i][key] + '</td>';
            else if (j == 0)
                html += '<td class="rank">' + myObj[i][key] + '</td>';
            else if (myObj[i][key] == null)
                html += '<td>' + 'n/a' + '</td>';
            else
                html += '<td>' + myObj[i][key] + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';
    
    html += "</table>";

    return html;
}

/* Custom format table using Bootstrap table */
function custom_format_table (table_selector) {
    
    $(table_selector + ' thead th').each(function() {
        if ( $(this).html() == 'ticker' )
            $(this).html('Ticker');
        else if ( $(this).html() == 'rank' )
            $(this).html('Rank');
        else if ( $(this).html() == 'binance_fee_usd' )
            $(this).html('Binance');
        else if ( $(this).html() == 'bittrex_fee_usd' )
            $(this).html('Bittrex');
        else if ( $(this).html() == 'poloniex_fee_usd' )
            $(this).html('Poloniex');
    });
    
    // Custom color depending on withdrawal fees
    $(table_selector + ' tbody tr td.usd').each(function() {
        if ($(this).html() < 1.0)
            $(this).addClass('table-success');
        else if ($(this).html() < 4.0)
            $(this).addClass('table-warning');
        else if ($(this).html() >= 4.0)
            $(this).addClass('table-danger');
    });
    

    $.extend($.fn.bootstrapTable.defaults, {
        locale: 'en-US',
  	    search: true,
  	    searchText: '',
  	    pagination: true,
  	    pageSize: 100
    });
    $.extend($.fn.bootstrapTable.columnDefaults, {
  	    sortable: true
    });
    $(table_selector).bootstrapTable();
}