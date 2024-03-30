$(function () {
 $(".sidebar-link").click(function () {
  $(".sidebar-link").removeClass("is-active");
  $(this).addClass("is-active");
 });
});

$(window)
 .resize(function () {
  if ($(window).width() > 1090) {
   $(".sidebar").removeClass("collapse");
  } else {
   $(".sidebar").addClass("collapse");
  }
 })
 .resize();

const allVideos = document.querySelectorAll(".video");

allVideos.forEach((v) => {
 v.addEventListener("mouseover", () => {
  const video = v.querySelector("video");
  video.play();
 });
 v.addEventListener("mouseleave", () => {
  const video = v.querySelector("video");
  video.pause();
 });
});

$(function () {
 $(".logo, .logo-expand, .discover").on("click", function (e) {
  $(".main-container").removeClass("show");
  $(".main-container").scrollTop(0);
 });
 $(".trending, .video").on("click", function (e) {
  $(".main-container").addClass("show");
  $(".main-container").scrollTop(0);
  $(".sidebar-link").removeClass("is-active");
  $(".trending").addClass("is-active");
 });

 $(".video").click(function () {
  var source = $(this).find("source").attr("src");
  var title = $(this).find(".video-name").text();
  var person = $(this).find(".video-by").text();
  var img = $(this).find(".author-img").attr("src");
  $(".video-stream video").stop();
  $(".video-stream source").attr("src", source);
  $(".video-stream video").load();
  $(".video-p-title").text(title);
  $(".video-p-name").text(person);
  $(".video-detail .author-img").attr("src", img);
 });
});



$('select[data-menu]').each(function() {

    let select = $(this),
        options = select.find('option'),
        menu = $('<div />').addClass('select-menu'),
        button = $('<div />').addClass('button'),
        list = $('<ul />'),
        arrow = $('<em />').prependTo(button);

    options.each(function(i) {
        let option = $(this);
        list.append($('<li />').text(option.text()));
    });

    menu.css('--t', select.find(':selected').index() * -41 + 'px');

    select.wrap(menu);

    button.append(list).insertAfter(select);

    list.clone().insertAfter(button);
    
});


$(document).on('click', '.select-menu', function(e) {

    let menu = $(this);

    if(!menu.hasClass('open')) {
        menu.addClass('open');
    }

});

$(document).on('click', '.select-menu > ul > li', function(e) {

    let li = $(this),
        menu = li.parent().parent(),
        select = menu.children('select'),
        selected = select.find('option:selected'),
        index = li.index();

    menu.css('--t', index * -41 + 'px');
    selected.attr('selected', false);
    select.find('option').eq(index).attr('selected', true);

    menu.addClass(index > selected.index() ? 'tilt-down' : 'tilt-up');

    setTimeout(() => {
        menu.removeClass('open tilt-up tilt-down');
    }, 500);

});

$(document).click(e => {
    e.stopPropagation();
    if($('.select-menu').has(e.target).length === 0) {
        $('.select-menu').removeClass('open');
    }
})

/* nav-tabs */
const navTabs = document.querySelectorAll("#nav-tabs > a");
navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    navTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    tab.classList.add("active");
  });
});

/* table-wrapper */
$(function () {
    new ProductTableApp(
      $('#product-table-app'),
      'https://gist.githubusercontent.com/yha-1228/dafe947f4437e83deb91136203cb1f2b/raw/2b8de5fb6126a51d750bfd38ef38464fdb44f8cf/products.json',
    );
  });
  
  // ----------------------------------------
  
  class ProductTableApp {
    /**
     * @param {JQuery<HTMLElement>} $el
     * @param {string} url
     */
    constructor($el, url) {
      this.initState();
      this.defineElements($el, this.state.products);
      this.render(this.state.products);
      this.fetchJson(url).then(
        (res) => {
          this.state.isLoaded = true;
          this.state.products = res;
          this.defineElements($el, this.state.products);
          this.render(this.state.products);
          this.bindEvents();
        },
        (jqXHR) => {
          this.state.err = jqXHR;
          console.log(`ERR! ${this.state.err.responseText}`);
        },
      );
    }
  
    initState() {
      this.state = { isLoaded: false, products: [], err: null };
    }
  
    /**
     * @param {string} url
     * @returns {Array}
     */
    fetchJson(url) {
      return $.ajax({
        url: url,
        dataType: 'json',
      });
    }
  
    /**
     *
     * @param {JQuery<HTMLElement>} $el
     * @param {Array} products
     */
    defineElements($el, products) {
      const brands = [...new Set(products.map((product) => product.brand))];
      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];
  
      this.$el = $el;
      this.$tbody = this.$el.find('tbody');
      this.$noResults = this.$el.find('#no-results');
      this.$handleTable = this.$el.find('.js-handle-table');
      this.$sortBy = this.$el.find('#sort-by');
      this.$filter = this.$el.find('.js-filter');
      this.$filterBrand = this.$el
        .find('#filter-brand')
        .append(
          brands.map((brand) => `<option value="${brand}">${brand}</option>`),
        );
      this.$filterCategory = this.$el
        .find('#filter-category')
        .append(
          categories.map(
            (category) => `<option value="${category}">${category}</option>`,
          ),
        );
      this.$hidingOutOfStock = this.$el.find('[value="hiding-out-of-stock"]');
    }
  
    bindEvents() {
      this.handleChange = this.handleChange.bind(this);
      this.$handleTable.on('change', this.handleChange);
    }
  
    handleChange() {
      const sorted = this.sort(this.state.products);
      const filtered = this.filter(sorted);
      const toggled = this.toggle(filtered);
      this.render(toggled);
    }
  
    /**
     * @param {Array} products
     * @returns {Array}
     */
    sort(products) {
      const $selectedSortTarget = this.$sortBy.find('option:selected');
      const val = $selectedSortTarget.val();
  
      // No sort
      if (val === 'none') {
        return products;
      }
  
      // val: Number
      if (val === 'price') {
        return [...products].sort((a, b) => {
          if (a[val] < b[val]) {
            return -1;
          }
          if (a[val] > b[val]) {
            return 1;
          }
          return 0;
        });
      }
  
      // val: String ('YYYY/MM/DD')
      if (val === 'created_at' || val === 'updated_at')
        return [...products].sort((a, b) => {
          /**
           * Convert 'YYYY/MM/DD' string to date
           * @param {String} dateString
           * @returns Date object
           */
          const toDate = (dateString) => {
            const momentObject = moment(dateString, 'YYYY/MM/DD');
            const dateObject = momentObject.toDate();
            return dateObject;
          };
  
          if (toDate(a[val]) < toDate(b[val])) return -1;
          if (toDate(a[val]) > toDate(b[val])) return 1;
          return 0;
        });
    }
  
    /**
     * @param {Array} products
     * @returns {Array}
     */
    filter(products) {
      const $selectedBrand = this.$filterBrand.find('option:selected');
      const $selectedCategory = this.$filterCategory.find('option:selected');
  
      /**
       * @param {Object} product
       */
      const isBrandValid = (product) => {
        return $selectedBrand.val() === 'all'
          ? product
          : product.brand === $selectedBrand.text();
      };
  
      /**
       * @param {Object} product
       */
      const isCategoryValid = (product) => {
        return $selectedCategory.val() === 'all'
          ? product
          : product.category === $selectedCategory.text();
      };
  
      return products.filter(isBrandValid).filter(isCategoryValid);
    }
  
    /**
     * @param {Array} products
     * @returns {Array}
     */
    toggle(products) {
      return this.$hidingOutOfStock.prop('checked')
        ? products.filter((product) => product.stocked === true)
        : products;
    }
  
    render(products) {
      const twoSpace = '&nbsp;&nbsp;';
  
      if (!this.state.isLoaded) {
        this.$tbody.html('<div>Loading...</div>');
        return;
      }
  
      this.$tbody.html(
        products.map(
          (product) =>
            `<tr class="table-row" data-key="${product.id}">
              <td class="table-cell align-right">${product.id}</td>
              <td class="table-cell align-left">${product.brand}</td>
              <td class="table-cell align-left">${product.name}</td>
              <td class="table-cell align-left">${product.category}</td>
              <td class="table-cell align-right">&yen; ${product.price}</td>
              <td class="table-cell align-left">${
                product.stocked
                  ? `<i class="fas fa-check-circle light-text"></i>${twoSpace}In stock`
                  : `<i class="fas fa-minus-circle light-text"></i>${twoSpace}Out of stock`
              }</td>
              <td class="table-cell align-left">${product.created_at}</td>
              <td class="table-cell align-left">${product.updated_at}</td>
            </tr>`,
        ),
      );
  
      products.length === 0
        ? this.$noResults.removeClass('hidden')
        : this.$noResults.addClass('hidden');
    }
  }

  ///////////////////////////////////////////////////
  /* Custom function1:Function for database-table show up */
  $(document).ready(function() {
    // Assuming your custom dropdown transformation code is here

    // Listen for click events on each list item within the custom menu
    $(document).on('click', '.select-menu li', function() {
        // Get the text of the clicked item
        var selectedText = $(this).text();

        // Hide all tables first
        $('.table-wrapper').hide();

        // Determine which table to show based on the selectedText
        if(selectedText === "DNA_EXP") {  /* TODO: modify databse name here */
            $('#table-container-test').show();
        } else if(selectedText === "XML") {
            $('#table-container-xml').show(); // Make sure to have this table in your HTML
        } else if(selectedText === "Dickens") {
            $('#table-container-dickens').show(); // Make sure to have this table in your HTML
        } // continue for other options as needed

        // Optionally, update the actual select to reflect the current selection
        // This is useful if you're submitting the form traditionally
        $('select[data-menu]').val(selectedText.toLowerCase()).change(); // Make sure the values match the case and spelling
    });


});

 /* SQL Editor */

  // document.addEventListener('DOMContentLoaded', function() {
  //   var sqlEditor = CodeMirror.fromTextArea(document.getElementById("sqlEditor"), {
  //       mode: "text/x-sql",
  //       theme: "monokai", // If you included a theme
  //       lineNumbers: true,
  //       lineWrapping: true,
  //       smartIndent: false,
  //       addModeClass: true
  //   });
  // });

  const sqlEditor = document.getElementById('sqlEditor');
  const lineNumbers = document.getElementById('lineNumbers');
  const runButton = document.getElementById('runButton');
  const saveButton = document.getElementById('saveButton');
  const fileInput = document.getElementById('fileInput');
  const dataImport = document.getElementById('dataImport');
  const uploadButton = document.getElementById('uploadButton');
  const importButton = document.getElementById('importButton');
  var has_comp_result = false; /* Indicate if we have some compression result to show */
  var has_eval_result = false; /* Indicate if we have some evaluation result to show *./
  /* TODO: save a Txn ID to indicate what information to show */

  function updateLineNumbers() {
    const linesCount = sqlEditor.value.split('\n').length;
    const lines = Array.from({ length: linesCount }, (_, i) => i + 1).join('\n');
    lineNumbers.textContent = lines;
  }

  sqlEditor.addEventListener('input', updateLineNumbers);
  sqlEditor.addEventListener('scroll', function() {
    lineNumbers.scrollTop = sqlEditor.scrollTop;
  });

  /* Click Run button!!!!! */
  runButton.addEventListener('click', function() {
    // Placeholder for the run action
    // alert('Running SQL Query:\n' + sqlEditor.value);
    var sqlQuery = document.getElementById("sqlEditor").value; // Get the query from the textarea
    var createTableRegex = /^\s*CREATE\s+TABLE/i; 
    var insertTableRegex = /^\s*INSERT\s+INTO/i;
    var selectRegex = /^\s*SELECT\s/i;

    // Check if the query is not empty
    if (sqlQuery.trim().length > 0) {
      if (createTableRegex.test(sqlQuery)) {
        /* TODO: deal with table creation */
        resetButton();
        resultButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
        resultButton.classList.add('bg-white', 'hover:bg-white', 'text-black');
        
        writeTableCreateInfo();
        has_comp_result = false;
        has_eval_result = false;

      }
      else if (insertTableRegex.test(sqlQuery)) {
        /* TODO: decide if we should write the whole table here */
        resetButton();
        resultButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
        resultButton.classList.add('bg-white', 'hover:bg-white', 'text-black');
    
        WriteDBInfo();
        has_comp_result = true;
        has_eval_result = false;
      }
      else if (selectRegex.test(sqlQuery)) {
        resetButton();
        resultButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
        resultButton.classList.add('bg-white', 'hover:bg-white', 'text-black');
    
        WriteQueryResultInfo();
        has_comp_result = false;
        has_eval_result = true;
      }
      else {
        alert('Running SQL Query:\n' + sqlEditor.value + 'Please enter a proper SQL query.');
      }
      /* TODO: add handling, show only one result */

      // fetch('/execute-query', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({query: sqlQuery}), // Send the query in the request body
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('Success:', data);
      //   // Process success response
      // })
      // .catch((error) => {
      //   console.error('Error:', error);
      //   // Handle errors here
      // });
    } else {
      alert("Please enter a SQL query.");
    }
  });

  saveButton.addEventListener('click', function() {
    // Placeholder for the run action
    // alert('Running SQL Query:\n' + sqlEditor.value);
    var sqlQuery = document.getElementById("sqlEditor").value; // Get the query from the textarea

    // Check if the query is not empty
    if (sqlQuery.trim().length > 0) {
      alert('Saving SQL Query:\n' + sqlQuery);
      /* TODO: add save to file handler */
    } else {
      alert("Nothing to save.");
    }
  });

  uploadButton.addEventListener('click', function() {
    fileInput.click();
  });

  importButton.addEventListener('click', function() {
    dataImport.click();
  });

  // Event listener for the file input change
  fileInput.addEventListener('change', function() {
    const file = this.files[0]; // Get the selected file
    /* TODO: add file type check, only accept .sql or something else */

    if (file) {
      // Use FileReader to read the file's content
      const reader = new FileReader();
      reader.onload = function(e) {
        sqlEditor.value = e.target.result; // Display file content in the textarea
        updateLineNumbers(); // Update line numbers accordingly
      };
      reader.readAsText(file); // Read the file as text
    }
  });
  
  dataImport.addEventListener('change', function() {
    const file = this.files[0]; // Get the selected file
    /* TODO: add file type check, only accept .sql or something else */

    if (file) {
      // // Use FileReader to read the file's content
      // const reader = new FileReader();
      // reader.onload = function(e) {
      //   sqlEditor.value = e.target.result; // Display file content in the textarea
      //   updateLineNumbers(); // Update line numbers accordingly
      // };
      // reader.readAsText(file); // Read the file as text
      /* TODO:  */
    }
  });

  // Initialize line numbers
  updateLineNumbers();

  /* Charts/Boards */
  function clearBoard() {
    // var background = document.getElementById('resultSQL');
    // background.style.height = '100%';  /* TODO: adjust as needed */
    document.getElementById("divResultSQL").style.display="none";
    document.getElementById("iframeResultSQL").style.display="inline";
    document.getElementById("iframeResultSQL").srcdoc = '';
    document.getElementById("chartsSection").style.display="none";
    document.getElementById("chartsSection-exe").style.display="none";
  }

  function WriteDBInfo() {
    clearBoard();
    /* TODO: check! database, table, query type. */

    const sampleData = [
      { seq_id: 1, exp_date: '2023-03-25', seq_data: 'ACTGACTGACTG...', quality_score: 95.5, exp_log: 'Successful sequencing...' },
      { seq_id: 2, exp_date: '2023-03-26', seq_data: 'TTGCACTGACTG...', quality_score: 92.3, exp_log: 'Minor errors noted...' },
      { seq_id: 3, exp_date: '2023-03-27', seq_data: 'GGACTGACTGAC...', quality_score: 89.7, exp_log: 'Repeated sequencing required...' },
      { seq_id: 4, exp_date: '2023-03-28', seq_data: 'CCAGTGACTGAC...', quality_score: 93.2, exp_log: 'High-quality sequencing data...' },
      { seq_id: 5, exp_date: '2023-03-29', seq_data: 'ACTGACTGACTG...', quality_score: 94.8, exp_log: 'Sequencing completed with no issues...' },
      { seq_id: 6, exp_date: '2023-03-30', seq_data: 'GACTGACTGACC...', quality_score: 88.4, exp_log: 'Sequencing partially successful...' },
      { seq_id: 7, exp_date: '2023-03-31', seq_data: 'TTGCACTGACCA...', quality_score: 91.1, exp_log: 'Minor quality issues detected...' },
      { seq_id: 8, exp_date: '2023-04-01', seq_data: 'CCAGTGACTGCA...', quality_score: 92.5, exp_log: 'Optimal sequencing results...' },
      { seq_id: 9, exp_date: '2023-04-02', seq_data: 'ACTGACAGACTA...', quality_score: 90.3, exp_log: 'Requires verification sequencing...' },
      { seq_id: 10, exp_date: '2023-04-03', seq_data: 'GACTGACCCACT...', quality_score: 87.8, exp_log: 'Completed with noted anomalies...' }
    ];

    var txt;
    
    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    ';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';

    /* TODO: Replace record number and runtime */
    txt = txt + '<div style="margin-top:10px; margin-bottom:10px;"> Number of Records: 10  &emsp; &emsp; Runtime: 10ms </div>';
    txt = txt + '<table class="w3-table-all notranslate">';
    txt = txt + '<tbody>';
    txt = txt + '<tr>';
    txt = txt + '<th align="center">seq_id</th>';
    txt = txt + '<th align="center">exp_date</th>';
    txt = txt + '<th align="center">seq_data</th>';
    txt = txt + '<th align="center">quality_score</th>';
    txt = txt + '<th align="center">exp_log</th>';
    txt = txt + '</tr>';

    // Appending sample data to txt
    sampleData.forEach(data => {
      txt += '<tr>';
      txt += `<td align="center">${data.seq_id}</td>`;
      txt += `<td align="center">${data.exp_date}</td>`;
      txt += `<td align="center"><a href="url_to_seq_data_page?seq_id=${data.seq_id}" target="_blank">${data.seq_data}</a></td>`;
      txt += `<td align="center">${data.quality_score}</td>`;
      txt += `<td align="center"><a href="url_to_exp_log_page?seq_id=${data.seq_id}" target="_blank">${data.exp_log}</a></td>`;
      txt += '</tr>';
    });

    txt = txt + '</tbody>'
    txt = txt + '</table>'
    txt = txt + '<div id="gtx-trans" style="position: absolute; left: 589px; top: 65px;>'
    txt = txt + '<div class="gtx-trans-icon"></div>'
    txt = txt + '</div>'
    txt = txt + '</body>'
    txt = txt + '</html>'
    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  function writeTableCreateInfo() {
    clearBoard();
    var txt;
    
    // txt = '';
    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    ';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';

    /* TODO: Replace record number and runtime */
    txt = txt + '<div style="margin-top:10px; margin-bottom:10px;"> Number of Records: 0  &emsp; &emsp; Runtime: 1ms </div>';
    txt = txt + '<table class="w3-table-all notranslate">';
    txt = txt + '<tbody>';
    txt = txt + '<tr>';
    txt = txt + '<th align="center">seq_id</th>';
    txt = txt + '<th align="center">exp_date</th>';
    txt = txt + '<th align="center">seq_data</th>';
    txt = txt + '<th align="center">quality_score</th>';
    txt = txt + '<th align="center">exp_log</th>';
    txt = txt + '</tr>';
    txt = txt + '</tbody>'
    txt = txt + '</table>'
    txt = txt + '<div id="gtx-trans" style="position: absolute; left: 589px; top: 65px;>'
    txt = txt + '<div class="gtx-trans-icon"></div>'
    txt = txt + '</div>'
    txt = txt + '</body>'
    txt = txt + '</html>'
    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  function writeAnalyzeInfo() {
    clearBoard();
    var txt;
    /* TODO: fetch explain analyze */
    txt = '';
    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    ';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';

    // Adding Query Plan
    txt += '<div style="margin-top:20px;">';
    txt += '<h3>Query Plan:</h3>';
    txt += '<pre>---------------------------------------------------------------:</pre>';
    txt += '<pre>Seq Scan on tenk1  (cost=0.00..458.00 rows=10000 width=244)</pre>';
    txt += '</div>';

    txt = txt + '</body>'
    txt = txt + '</html>'

    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  function writeCompareInfo() {
    clearBoard();
    document.getElementById("iframeResultSQL").style.display="none";
    document.getElementById("chartsSection").style.display="block";

    // Delay chart initialization
    setTimeout(function() {
      // Chart initialization code 
      // var background = document.getElementById('resultSQL');
      // background.style.height = '380px';  /* TODO: adjust as needed */

      var canvas = document.getElementById('myChart');
      canvas.style.height = '280px'; /* TODO: adjust as needed */
      var ctx = canvas.getContext('2d');
      var myChart = new Chart(ctx, myChartConfig);
  
      canvas = document.getElementById('myChart2');
      canvas.style.height = '280px'; /* TODO: adjust as needed */
      ctx = canvas.getContext('2d');
      var myChart2 = new Chart(ctx, errorChartConfig);
    }, 0); 
    // setTimeout with 0 delay ensures the DOM updates are applied first
  }

  function writeExeInfo() {
    clearBoard();
    document.getElementById("iframeResultSQL").style.display="none";
    document.getElementById("chartsSection-exe").style.display="block";

    // Delay chart initialization
    setTimeout(function() {
      // Chart initialization code 
      var canvas = document.getElementById('myChart3');
      canvas.style.height = '280px'; /* TODO: adjust as needed */
      var ctx = canvas.getContext('2d');
      var myChart = new Chart(ctx, lineChartConfig);
  
      canvas = document.getElementById('myChart4');
      canvas.style.height = '280px'; /* TODO: adjust as needed */
      ctx = canvas.getContext('2d');
      var myChart2 = new Chart(ctx, memChartConfig);
    }, 0); 


  }

  function writeStaInfo() {
    clearBoard();
    /* TODO: check! database, table, query type. */
    var txt;

    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    ';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';

    /* TODO: Replace record number and runtime */
    txt = txt + '<div style="margin-top:10px; margin-bottom:10px;"> Number of Records: 5  &emsp; &emsp; Runtime: 10ms </div>';
    txt = txt + '<table class="w3-table-all notranslate">';
    txt = txt + '<tbody>';
    txt = txt + '<tr>';
    txt = txt + '<th align="left" rowspan="2">Column Name</th>';
    txt = txt + '<th align="left" rowspan="2">TEXT Size</th>';
    txt = txt + '<th align="center" colspan="3"> PGLZ Metrics</th>';
    txt = txt + '<th align="center" colspan="3"> RLE Metrics</th>';
    txt = txt + '<th align="center" colspan="3"> TADOC Metrics</th>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<th align="center">Size</th>';
    txt = txt + '<th align="center">CPR</th>';
    txt = txt + '<th align="center">CPT</th>';
    txt = txt + '<th align="center">Size</th>';
    txt = txt + '<th align="center">CPR</th>';
    txt = txt + '<th align="center">CPT</th>';
    txt = txt + '<th align="center">Size</th>';
    txt = txt + '<th align="center">CPR</th>';
    txt = txt + '<th align="center">CPT</th>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<td align="center">Col1</td>';
    txt = txt + '<td align="center">60MB</td>';
    txt = txt + '<td align="center">40MB</td>';
    txt = txt + '<td align="center">1.5</td>';
    txt = txt + '<td align="center">100.00ms</td>';
    txt = txt + '<td align="center">20MB</td>';
    txt = txt + '<td align="center">3.0</td>';
    txt = txt + '<td align="center">70ms</td>';
    txt = txt + '<td align="center">15MB</td>';
    txt = txt + '<td align="center">4.0</td>';
    txt = txt + '<td align="center">80ms</td>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<td align="center">Col1</td>';
    txt = txt + '<td align="center">60MB</td>';
    txt = txt + '<td align="center">40MB</td>';
    txt = txt + '<td align="center">1.5</td>';
    txt = txt + '<td align="center">100.00ms</td>';
    txt = txt + '<td align="center">20MB</td>';
    txt = txt + '<td align="center">3.0</td>';
    txt = txt + '<td align="center">70ms</td>';
    txt = txt + '<td align="center">15MB</td>';
    txt = txt + '<td align="center">4.0</td>';
    txt = txt + '<td align="center">80ms</td>';
    txt = txt + '</tr>';
    txt = txt + '</tbody>'
    txt = txt + '</table>'

    txt = txt + '<div id="gtx-trans" style="position: absolute; left: 589px; top: 65px;>'
    txt = txt + '<div class="gtx-trans-icon"></div>'
    txt = txt + '</div>'
    txt = txt + '</body>'
    txt = txt + '</html>'

    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  function writeQueryStaInfo() {
    clearBoard();
    /* TODO: check! database, table, query type. */
    var txt;

    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    .execution-time-last-header {border-right: 1px solid #b5b7ba;}\
    .execution-time-last-tablet {border-right: 1px solid #b5b7ba;}';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';

    /* TODO: Replace record number and runtime */
    txt = txt + '<div style="margin-top:10px; margin-bottom:10px;"> Number of Records: 5  &emsp; &emsp; Runtime: 10ms </div>';
    txt = txt + '<table class="w3-table-all notranslate">';
    txt = txt + '<tbody>';
    txt = txt + '<tr>';
    // txt = txt + '<th align="left" rowspan="2">Column Name</th>';
    txt = txt + '<th align="center" colspan="5" class="execution-time-last-header">Avg. Execution Time</th>';
    txt = txt + '<th align="center" colspan="5">Avg. Peak Memory</th>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<th align="center">Row-1</th>';
    txt = txt + '<th align="center">Row-2</th>';
    txt = txt + '<th align="center">Row-3</th>';
    txt = txt + '<th align="center">Row-4</th>';
    txt = txt + '<th align="center" class="execution-time-last-tablet">Row-5</th>';
    txt = txt + '<th align="center">Row-1</th>';
    txt = txt + '<th align="center">Row-2</th>';
    txt = txt + '<th align="center">Row-3</th>';
    txt = txt + '<th align="center">Row-4</th>';
    txt = txt + '<th align="center">Row-5</th>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center" class="execution-time-last-tablet">1ms</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '</tr>';
    txt = txt + '<tr>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center">1ms</td>';
    txt = txt + '<td align="center" class="execution-time-last-tablet">1ms</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '<td align="center">10MB</td>';
    txt = txt + '</tr>';
    txt = txt + '</tbody>'
    txt = txt + '</table>'

    txt = txt + '<div id="gtx-trans" style="position: absolute; left: 589px; top: 65px;>'
    txt = txt + '<div class="gtx-trans-icon"></div>'
    txt = txt + '</div>'
    txt = txt + '</body>'
    txt = txt + '</html>'

    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  function WriteQueryResultInfo() {
    clearBoard();
    var txt;
    txt = '<html lang="en-US">';
    txt = txt + '<head>';
    txt = txt + '<style>';
    txt = txt + 'html,body{font-family:Verdana,sans-serif;font-size:14px;line-height:1.5}html{overflow-x:hidden} \
    h3{font-size:24px} \
    h1,h2,h3,h4,h5,h6{font-family:"Segoe UI",Arial,sans-serif;font-weight:400;margin:10px 0}\
    .w3-table-all{border-collapse:collapse;border-spacing:0;width:100%;display:table;border:1px solid #ccc}\
    .w3-table-all tr{border-bottom:1px solid #ddd}\
    .w3-table-all tr:nth-child(odd){background-color:#fff}.w3-table-all tr:nth-child(even){background-color:#f1f1f1}\
    .w3-table-all td,.w3-table-all th{padding:8px 8px;display:table-cell;text-align:left;vertical-align:top}\
    .w3-table th:first-child,.w3-table-all th:first-child,.w3-table-all td:first-child{padding-left:16px}\
    ';
    txt = txt + '</style>';
    txt = txt + '</head>';
    txt = txt + '<body>';
    txt = txt + '<h3> To-do </h3>'

    txt = txt + '<div id="gtx-trans" style="position: absolute; left: 589px; top: 65px;>'
    txt = txt + '<div class="gtx-trans-icon"></div>'
    txt = txt + '</div>'
    txt = txt + '</body>'
    txt = txt + '</html>'
    document.getElementById("iframeResultSQL").srcdoc = txt;

  }

  const resultButton = document.getElementById('resultButton');
  const visualButton = document.getElementById('visualButton');
  const staButton = document.getElementById('staButton');

  // set all button to background color
  function resetButton() {
    resultButton.classList.remove('bg-white', 'hover:bg-white', 'text-black');
    resultButton.classList.add('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')

    visualButton.classList.remove('bg-white', 'hover:bg-white', 'text-black');
    visualButton.classList.add('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')

    staButton.classList.remove('bg-white', 'hover:bg-white', 'text-black');
    staButton.classList.add('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')

  }
  /* Click Run button!!!!! */
  resultButton.addEventListener('click', function() {
    /* TODO */    
    resetButton();
    resultButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
    resultButton.classList.add('bg-white', 'hover:bg-white', 'text-black');

    if (has_comp_result) /* TODO: means insert */
      WriteDBInfo();
    else if (has_eval_result)
      WriteQueryResultInfo(); /* TODO */

  });

  visualButton.addEventListener('click', function() {
    resetButton();
    visualButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
    visualButton.classList.add('bg-white', 'hover:bg-white', 'text-black');

    /* TODO */
    if (has_comp_result)
      writeCompareInfo();
    else if (has_eval_result) {
      writeExeInfo();
    }
  });

  staButton.addEventListener('click', function() {
    resetButton();
    staButton.classList.remove('bg-white-500', 'hover:bg-gray-300', 'text-gray', 'hover:text-black')
    staButton.classList.add('bg-white', 'hover:bg-white', 'text-black');

    /* TODO */
    if (has_comp_result) 
      writeStaInfo();
    else if (has_eval_result)
      writeQueryStaInfo();
  });
  

// Global defaults
Chart.defaults.global.animation.duration = 2000; // Animation duration
Chart.defaults.global.title.display = false; // Remove title
Chart.defaults.global.defaultFontColor = '#71748c'; // Font color
Chart.defaults.global.defaultFontSize = 13; // Font size for every label

// Tooltip global resets
Chart.defaults.global.tooltips.backgroundColor = '#111827'
Chart.defaults.global.tooltips.borderColor = 'blue'

// Gridlines global resets
Chart.defaults.scale.gridLines.zeroLineColor = '#3b3d56'
Chart.defaults.scale.gridLines.color = '#3b3d56'
Chart.defaults.scale.gridLines.drawBorder = false

// Legend global resets
Chart.defaults.global.legend.labels.padding = 0;
Chart.defaults.global.legend.display = false;

// Ticks global resets
Chart.defaults.scale.ticks.fontSize = 12
Chart.defaults.scale.ticks.fontColor = '#71748c'
Chart.defaults.scale.ticks.beginAtZero = false
Chart.defaults.scale.ticks.padding = 10

// Elements globals
Chart.defaults.global.elements.point.radius = 0

// Responsivess
Chart.defaults.global.responsive = true
Chart.defaults.global.maintainAspectRatio = false

// Define a custom plugin to draw numbers above bars
var numberAboveBarsPlugin = {
  afterDraw: function(chart) {
    var ctx = chart.ctx;
    chart.data.datasets.forEach(function(dataset, i) {
      var meta = chart.getDatasetMeta(i);
      if (!meta.hidden) {
        meta.data.forEach(function(element, index) {
          // Draw the text in black, with the specified font
          ctx.fillStyle = '#000'; // Text color
          ctx.font = 'bold 12px Arial'; // Text font
          
          var dataString = dataset.data[index].toString();
          
          // Calculate the position to draw the text
          // It's positioned slightly above the top of the bar.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          var padding = 5; // Padding between the bar and the number
          var position = element.tooltipPosition();
          ctx.fillText(dataString, position.x, position.y - padding);
        });
      }
    });
  }
};


var errorBarsPlugin = {
  afterDraw: function(chart) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function(dataset, datasetIndex) {
          var meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
              meta.data.forEach(function(element, index) {
                  // Error value for this data point
                  var errorValue = dataset.error[index];
                  var dataValue = dataset.data[index];

                  var xPos = element._model.x;
                  var yPos = element._model.y;
                  var yBase = chart.scales['y-axis-0'].getPixelForValue(0); // Change 'y-axis-0' if your axis ID is different

                  // Calculate top and bottom Y positions of the error bar
                  var yTop = chart.scales['y-axis-0'].getPixelForValue(dataValue + errorValue);
                  var yBottom = chart.scales['y-axis-0'].getPixelForValue(dataValue - errorValue);

                  // Set style
                  ctx.strokeStyle = "#000000";
                  ctx.lineWidth = 2;

                  // Draw the error bar line
                  ctx.beginPath();
                  ctx.moveTo(xPos, yTop);
                  ctx.lineTo(xPos, yBottom);
                  ctx.stroke();

                  // Draw the top cap
                  ctx.beginPath();
                  ctx.moveTo(xPos - 5, yTop);
                  ctx.lineTo(xPos + 5, yTop);
                  ctx.stroke();

                  // Draw the bottom cap
                  ctx.beginPath();
                  ctx.moveTo(xPos - 5, yBottom);
                  ctx.lineTo(xPos + 5, yBottom);
                  ctx.stroke();
              });
          }
      });
  },
  animation: {
    duration: 2000
  }
};

// The bar chart

/* Chart 1 */
/* TODO: Generate new chart */
/* TODO-later: automatically adujst figure width and placement */
myData = {
  labels: [[["TEXT", "PGLZ", "RLE", "TADOC"], "seq_data"], [["TEXT", "PGLZ", "RLE", "TADOC"], "exp_log"]], /* TODO: adjust */
  // labels: [[[], ["seq_data"]], "exp_log"],
  /* TODO: adjust */
  datasets: [
    {
    label: "Original",
    data: [45, 25],
    backgroundColor: "#0d6efd",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "PGLZ",
    startAngle: 2,
    data: [20, 40],
    backgroundColor: "#dc3545",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "RLE",
    startAngle: 2,
    data: [20, 40],
    backgroundColor: "#f0ad4e",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "TADOC",
    startAngle: 2,
    data: [20, 40],
    backgroundColor: "#0c771a",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }]
}

myOptions = {
  scales: {
    yAxes: [{
      // stacked: true, 
      gridLines: {},
      ticks: {
        beginAtZero: true,
        stepSize: 20, /* TODO: set based on dataset */
        max: 60, /* TODO: set the maximum y value based on dataset */
      },
      scaleLabel: {
        display: true,
        labelString: 'Sample TEXT Size (MB)'
      }
    }],
    xAxes: [{
      scaleLabel: {
        display: true,
        padding: 0 // Adjust this value to bring the labels closer or further, the smaller the further
      },
      gridLines: {
        display: false,
      },
      /* TODO: adjust */
      categoryPercentage: 0.8, // Adjusts the spacing between groups of bars
      barPercentage: 0.7, // Adjusts the width of bars within those groups
    }]
  },

  tooltips: {
    enabled: false // Disable tooltips here
  }
}

var myChartConfig = {
  type: 'bar',
  data: myData,
  options: myOptions,
  plugins: [numberAboveBarsPlugin],
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, myChartConfig);


/* Chart 2 */
/* bar chart with error */
errorData = {
  labels: [[["TEXT", "PGLZ", "RLE", "TADOC"], "seq_data"], [["TEXT", "PGLZ", "RLE", "TADOC"], "exp_log"]], /* TODO: adjust */
  // labels: [[[], ["seq_data"]], "exp_log"],
  /* TODO: adjust */
  datasets: [
  {
    label: "Original",
    error: [5, 5],  /* TODO: modify error, sigma */
    data: [45, 25], /* TODO: modify median */
    backgroundColor: "#0d6efd",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "PGLZ",
    startAngle: 2,
    data: [20, 40],
    error: [5, 5],
    backgroundColor: "#dc3545",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "RLE",
    startAngle: 2,
    data: [20, 40],
    error: [5, 5],
    backgroundColor: "#f0ad4e",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }, {
    label: "TADOC",
    startAngle: 2,
    data: [20, 40],
    error: [5, 5],
    backgroundColor: "#0c771a",
    borderColor: 'transparent',
    borderWidth: 2.5,
    barPercentage: 0.4,
  }]
}

errorOptions = {
  scales: {
    yAxes: [{
      gridLines: {},
      ticks: {
        beginAtZero: true,
        stepSize: 20, /* TODO: set based on dataset */
        max: 60, /* TODO: set the maximum y value based on dataset */
      },
      scaleLabel: {
        display: true,
        labelString: 'Throughput (MB/s)'
      }
    }],
    xAxes: [{
      scaleLabel: {
        display: true,
        padding: 0 // Adjust this value to bring the labels closer or further, the smaller the further
      },
      gridLines: {
        display: false,
      },
      /* TODO: adjust */
      categoryPercentage: 0.8, // Adjusts the spacing between groups of bars
      barPercentage: 0.7, // Adjusts the width of bars within those groups
    }]
  },

  tooltips: {
    enabled: false // Disable tooltips here
  }
}

var errorChartConfig = {
  type: 'bar',
  data: errorData,
  options: errorOptions,
  plugins: [errorBarsPlugin],
}

var chart = new Chart(document.getElementById('myChart2'), errorChartConfig);

/* Chart 3 */
var lineData = {
  labels: ["row-1", "row-2", "row-3", "row-4", "row-5"],
  datasets: [{
    // Upper bound
    label: "Upper Bound",
    data: [22,37,24,37,24,43,30,48], // upper values
    fill: '+1', // Fill to next dataset
    backgroundColor: '#e1ecfc', // Use a transparent background
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Lower bound
    label: "Lower Bound",
    data: [18,33,20,33,20,39,26,44], // lower values
    fill: false, // No fill for the lower bound
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Actual data line
    label: "TEXT",
    data: [20, 35, 22, 35, 22, 41, 28, 46],
    fill: false,
    backgroundColor: 'transparent',
    borderColor: '#0d6efd',
    lineTension: 0.4,
    borderWidth: 1.5,
    pointBackgroundColor: '#0d6efd',
    // pointBorderColor: "#fff",
    pointRadius: 2,
    pointBorderWidth: 1,
    pointStyle: 'circle'
  },{
    // Upper bound
    label: "Upper Bound",
    data: [18,32,18,32,18,38,23,37], // upper values
    fill: '+1', // Fill to next dataset
    backgroundColor: '#d7bcbf', // Use a transparent background
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Lower bound
    label: "Lower Bound",
    data: [14,28,14,28,14,34,19,33], // lower values
    fill: false, // No fill for the lower bound
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Actual data line
    label: "PGLZ",
    data: [16, 30, 16, 30, 16, 36, 21, 35],
    fill: false,
    backgroundColor: 'transparent',
    borderColor: '#dc3545',
    lineTension: 0.4,
    borderWidth: 1.5,
    pointBackgroundColor: '#dc3545',
    // pointBorderColor: "#fff",
    pointRadius: 2,
    pointBorderWidth: 1,
  },{
    // Upper bound
    label: "Upper Bound",
    data: [13, 27, 12, 27, 12, 32, 16, 25], // upper values
    fill: '+1', // Fill to next dataset
    backgroundColor: '#f8ead7', // Use a transparent background
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Lower bound
    label: "Lower Bound",
    data: [9, 23, 8, 23, 8, 28, 12, 21], // lower values
    fill: false, // No fill for the lower bound
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Actual data line
    label: "RLE",
    data: [11, 25, 10, 25, 10, 30, 14, 23],
    fill: false,
    backgroundColor: 'transparent',
    borderColor: '#f0ad4e',
    lineTension: 0.4,
    borderWidth: 1.5,
    pointBackgroundColor: '#f0ad4e',
    // pointBorderColor: "#fff",
    pointRadius: 2,
    pointBorderWidth: 1,
  }, {
    // Upper bound
    label: "Upper Bound",
    data: [16, 28, 17, 27, 17, 33, 21, 30], // upper values
    fill: '+1', // Fill to next dataset
    backgroundColor: '#dcf5e0', // Use a transparent background
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Lower bound
    label: "Lower Bound",
    data: [12, 22, 12, 22, 12, 27, 17, 26], // lower values
    fill: false, // No fill for the lower bound
    borderColor: 'transparent', // Hide the line
    lineTension: 0.4,
    borderWidth: 1.5,
  }, {
    // Actual data line
    label: "TADOC",
    data: [14, 25, 15, 25, 15, 30, 19, 28],
    fill: false,
    backgroundColor: 'transparent',
    borderColor: '#0c771a',
    lineTension: 0.4,
    borderWidth: 1.5,
    pointBackgroundColor: '#0c771a', // Set circle background color
    // pointBorderColor: "#fff", // Set circle border color
    pointRadius: 2, // Set circle radius
    pointBorderWidth: 1, // Set circle border width
  }]
};

var lineOptions = {
  scales: {
    yAxes: [{
      gridLines: {
        drawBorder: false
      },
      ticks: {
        stepSize: 10,
        max: 40, /* TODO: adjust this */
      },
      scaleLabel: {
        display: true,
        labelString: 'Execution Time (ms)'
      }
    }],
    xAxes: [{
      gridLines: {
        display: false,
      },
      scaleLabel: {
        padding: 0
      }
    }]
  },
  legend: {
    display: true,
    labels: {
      filter: function(legendItem, ChartData) {
        if (legendItem.text == "Lower Bound" || legendItem.text == "Upper Bound")
          return false;
        return true;
      },
      usePointStyle: true,
      boxWidth: 3, /* Adjust the legend circle size */
      padding: 10,
    }
  }
}

var lineChartConfig = {
  type: 'line',
  data: lineData,
  options: lineOptions,
}

// The line chart
var chart = new Chart(document.getElementById('myChart3'), lineChartConfig)

/* Chart 4 */
var memData = {
  labels: ["row-1", "row-2", "row-3", "row-4", "row-5"],
  datasets: [{
    label: "TEXT",
    lineTension: 0.2,
    borderColor: '#337ab7',
    borderWidth: 1.5,
    showLine: true,
    data: [3, 30, 16, 30, 16, 36, 21, 40, 20, 30],
    backgroundColor: 'transparent',
    pointBackgroundColor: '#337ab7',
    // pointBorderColor: "#fff",
    pointRadius: 2,
    pointBorderWidth: 1,
    pointStyle: 'circle'
  }, {
    label: "PGLZ",
    lineTension: 0.2,
    borderColor: '#d9534f',
    borderWidth: 1.5,
    data: [16, 25, 10, 25, 10, 30, 14, 23, 14, 29],
    backgroundColor: 'transparent',
    pointBackgroundColor: '#d9534f',
    // pointBorderColor: "#fff",
    pointRadius: 2,
    pointBorderWidth: 1,
    pointStyle: 'circle'
  },
  {
               label: "RLE",
               lineTension: 0.2,
               borderColor: '#f0ad4e',
               borderWidth: 1.5,
               data: [12, 20, 15, 20, 5, 35, 10, 15, 35, 25],
               backgroundColor: 'transparent',
               pointBackgroundColor: '#f0ad4e',
               // pointBorderColor: "#fff",
               pointRadius: 2,
               pointBorderWidth: 1,
               pointStyle: 'circle'
             },
             {
               label: "TADOC",
               lineTension: 0.2,
               borderColor: '#5cb85c',
               borderWidth: 1.5,
               data: [6, 20, 5, 20, 5, 25, 9, 18, 20, 15],
               backgroundColor: 'transparent',
               pointBackgroundColor: '#5cb85c',
               // pointBorderColor: "#fff",
               pointRadius: 2,
               pointBorderWidth: 1,
               pointStyle: 'circle'
             }]
}

var memOptions = {
  scales: {
    yAxes: [{
      gridLines: {
        drawBorder: false
      },
      ticks: {
        stepSize: 12
      },
      scaleLabel: {
        display: true,
        labelString: 'Peak Memory (MB)'
      }
    }],
    xAxes: [{
      gridLines: {
        display: false,
      },
    }],
  },
  legend: {
    display: true,
    labels: {
      filter: function(legendItem, ChartData) {
        if (legendItem.text == "Lower Bound" || legendItem.text == "Upper Bound")
          return false;
        return true;
      },
      usePointStyle: true,
      boxWidth: 3, /* Adjust the legend circle size */
      padding: 10,
    }
  }
}

var memChartConfig = {
  type: 'line',
  data: memData,
  options: memOptions,
}
var chart = document.getElementById('myChart4');
var myChart = new Chart(chart, {memChartConfig})

