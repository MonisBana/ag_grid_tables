import React, { useState } from "react";
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import { country } from "../CountriesCities";
import { DeleteOutlined } from "@ant-design/icons";
import classes from "./Tables.module.css";
import { Button } from "antd";
import "antd/dist/antd.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker";
import "jquery-ui-dist/jquery-ui.css";

function Tables() {
  const [gridApi, setGridApi] = useState(null);
  const [igridApi, setIGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [igridColumnApi, setIGridColumnApi] = useState(null);
  const [cities, setCities] = useState([]);
  const data = JSON.parse(localStorage.getItem("rowData"));
  const [rowData, setRowData] = useState(
    data
      ? data
      : [
          {
            Id: 1,
            Name: "Janie",
            Email: "jclampton0@over-blog.com",
            Gender: "Female",
            DOB: "03-07-1998",
            City: "Kabul",
            Country: "Afghanistan",
          },
          {
            Id: 2,
            Name: "Kassie",
            Email: "ksimonyi1@slashdot.org",
            Gender: "Female",
            DOB: "24-12-1987",
            City: "Harare",
            Country: "Zimbabwe",
          },
          {
            Id: 3,
            Name: "Homerus",
            Email: "hivanenkov2@163.com",
            Gender: "Male",
            DOB: "14-01-1990",
            City: "Dhaka",
            Country: "Bangladesh",
          },
          {
            Id: 4,
            Name: "Monis",
            Email: "monisbana04@gmail.com",
            Gender: "Male",
            DOB: "11-02-2021",
            City: "Dubai",
            Country: "United Arab Emirates",
          },
        ]
  );

  const [newrowData, setNewRowData] = useState([]);

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  function onIGridReady(params) {
    setIGridApi(params.api);
    setIGridColumnApi(params.columnApi);
  }

  // Remove Selected Rows
  const removeSelected = () => {
    const selectedRowNodes = gridApi.getSelectedNodes();
    const selectedIds = selectedRowNodes.map(function (rowNode) {
      return rowNode.data.Id;
    });
    const filteredData = rowData.filter(function (dataItem) {
      return !selectedIds.includes(dataItem.Id);
    });
    setRowData(filteredData);
    gridApi.setRowData(filteredData);
  };

  // Remove Non Selected Rows
  const removeNonSelected = () => {
    var selectedRowNodes = gridApi.getSelectedNodes();
    var selectedIds = selectedRowNodes.map(function (rowNode) {
      return rowNode.data.Id;
    });
    const filteredData = rowData.filter(function (dataItem) {
      return selectedIds.includes(dataItem.Id);
    });
    setRowData(filteredData);
    gridApi.setRowData(filteredData);
  };

  function getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function (params) {
      this.eInput = document.createElement("input");
      this.eInput.value = params.value;
      this.eInput.classList.add("ag-input");
      this.eInput.style.height = "100%";
      $(this.eInput).datepicker({ dateFormat: "dd-mm-yy" });
    };
    Datepicker.prototype.getGui = function () {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function () {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function () {};
    Datepicker.prototype.isPopup = function () {
      return false;
    };
    return Datepicker;
  }

  // Delete Button
  const DeleteRow = (params) => {
    return <DeleteOutlined onClick={() => deleteHandler(params)} />;
  };
  const deleteHandler = (params) => {
    params.api.applyTransaction({ remove: [params.data] });
    params.api.refreshCells({ force: true });
  };

  const components = {
    dateEditor: getDatePicker(),
  };
  const frameworkComponents = {
    btnCellRenderer: DeleteRow,
  };

  // Add Rows
  function addData() {
    let selectedRowNodes = gridApi.getSelectedNodes();
    let index;

    if (selectedRowNodes.length !== 0) {
      index = selectedRowNodes[selectedRowNodes.length - 1].childIndex;
    } else {
      index = rowData.length - 1;
    }
    const newRowData = rowData;
    newRowData.splice(index + 1, 0, {});
    gridApi.setRowData(newRowData);
  }
  //Helper functions to populate Country City dropdown accordingly
  function lookupValue(mappings, key) {
    return mappings[key];
  }
  function extractValues(mappings) {
    return Object.keys(mappings);
  }
  const genderMappings = {
    Male: "Male",
    Female: "Female",
  };
  const genders = extractValues(genderMappings);
  const countries = extractValues(country);

  const populateCities = (Country) => {
    setCities(country[Country]);
  };

  //Add Data to submit table and to localStorage
  const onSubmit = () => {
    setNewRowData(rowData);
    localStorage.setItem("rowData", JSON.stringify(rowData));
    igridApi.setRowData(rowData);
  };

  //Function to validate Email
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button className={classes.btns} onClick={() => addData()}>
            Add Row
          </Button>
          <Button className={classes.btns} onClick={() => removeSelected()}>
            Delete Selected Rows
          </Button>
          <Button className={classes.btns} onClick={() => removeNonSelected()}>
            Delete Non Selected Rows
          </Button>
          <Button className={classes.btns} onClick={() => onSubmit()}>
            Submit
          </Button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{
            height: 330,
            width: 1500,
          }}
        >
          <AgGridReact
            modules={AllModules}
            popupParent={document.querySelector("body")}
            onGridReady={onGridReady}
            rowData={rowData}
            rowSelection="multiple"
            components={components}
            frameworkComponents={frameworkComponents}
            enableCellEditOnFocus={true}
            defaultColDef={{
              flex: 1,
              minWidth: 110,
              editable: true,
              resizable: true,
              sortable: true,
              filter: true,
            }}
            animateRows={true}
            singleClickEdit={true}
            tooltipShowDelay={0}
            enableBrowserTooltips={true}
            // pagination={true}
            // paginationAutoPageSize={true}
          >
            <AgGridColumn
              field="Id"
              checkboxSelection={true}
              pinned="left"
              cellStyle={(params) => {
                if (params.value) {
                  if (params.value.length === 0) {
                    return { backgroundColor: "red" };
                  }
                  return { backgroundColor: "transperant" };
                }
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="Name"
              pinned="left"
              tooltipField="Name"
              cellStyle={(params) => {
                if (params.value) {
                  if (params.value.length === 0) {
                    return { backgroundColor: "red" };
                  }
                  return { backgroundColor: "white" };
                }
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="Email"
              tooltipField="Email"
              cellStyle={(params) => {
                if (params.value) {
                  if (validateEmail(params.value)) {
                    return { backgroundColor: "yellow" };
                  }
                  return { backgroundColor: "white" };
                }
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="Gender"
              cellEditor="agSelectCellEditor"
              tooltipField="Gender"
              cellEditorParams={{ values: genders }}
              filterParams={{
                valueFormatter: (params) => {
                  return lookupValue(genderMappings, params.value);
                },
              }}
              valueFormatter={(params) => {
                return lookupValue(genderMappings, params.value);
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="DOB"
              tooltipField="DOB"
              cellEditor="dateEditor"
              filter="agDateColumnFilter"
              filterParams={{
                clearButton: true,
                suppressAndOrCondition: true,
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                  var dateAsString = cellValue;
                  var dateParts = dateAsString.split("-");
                  var cellDate = new Date(
                    Number(dateParts[2]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[0])
                  );
                  if (
                    filterLocalDateAtMidnight.getTime() === cellDate.getTime()
                  ) {
                    return 0;
                  }
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }
                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                },
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="Country"
              tooltipField="Country"
              cellEditor="agSelectCellEditor"
              cellEditorParams={{ values: countries }}
              onCellValueChanged={(params) => populateCities(params.newValue)}
              filterParams={{
                valueFormatter: (params) => {
                  return lookupValue(country, params.value);
                },
              }}
              valueFormatter={(params) => {
                return lookupValue(countries, params.value);
              }}
            ></AgGridColumn>
            <AgGridColumn
              field="City"
              tooltipField="City"
              cellEditor="agSelectCellEditor"
              cellEditorParams={{ values: cities }}
              filterParams={{
                valueFormatter: (params) => {
                  return lookupValue(cities, params.value);
                },
              }}
              valueFormatter={(params) => {
                return lookupValue(cities, params.value);
              }}
            ></AgGridColumn>
            <AgGridColumn
              editable={false}
              cellStyle={{ color: "rgb(255, 77, 79)" }}
              cellRenderer="btnCellRenderer"
              cellRendererParams={{
                onClick: () => DeleteRow(),
                label: "Click",
              }}
            ></AgGridColumn>
          </AgGridReact>
          <h3 style={{ fontWeight: "bold", margin: "10px" }}>Submitted Data</h3>
          <AgGridReact
            onGridReady={onIGridReady}
            rowData={newrowData}
            defaultColDef={{
              flex: 1,
              minWidth: 110,
              filter: true,
            }}
          >
            <AgGridColumn field="Id"></AgGridColumn>
            <AgGridColumn field="Name"></AgGridColumn>
            <AgGridColumn field="Email"></AgGridColumn>
            <AgGridColumn field="Gender"></AgGridColumn>
            <AgGridColumn field="DOB"></AgGridColumn>
            <AgGridColumn field="Country"></AgGridColumn>
            <AgGridColumn field="City"></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    </div>
  );
}

export default Tables;
