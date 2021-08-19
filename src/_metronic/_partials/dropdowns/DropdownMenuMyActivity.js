/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";

export function DropdownMenuMyActivity({ dataPeriod = [], handle }) {
  return (
    <>
      {/*begin::Navigation*/}
      <ul className="navi navi-hover">
        <li className="navi-header font-weight-bold py-5">
          <span className="font-size-lg">Filter:</span>
        </li>
        <li className="navi-separator mb-3 opacity-70"></li>
        <li
          className="navi-item"
          onClick={() => {
            handle("no_date", null);
          }}
        >
          <a href="#" className="navi-link">
            <span className="navi-text">
              <span className="label label-xl label-inline label-light-primary">
                Semua
              </span>
            </span>
          </a>
        </li>
        {dataPeriod.map((item, index) => {
          return (
            <li
              className="navi-item"
              key={index.toString()}
              onClick={() => {
                handle("no_date", item.ident_name);
              }}
            >
              <a href="#" className="navi-link">
                <span className="navi-text">
                  <span className="label label-xl label-inline label-light-success">
                    {item.period_name}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
        <li
          className="navi-item"
          onClick={() => {
            handle("date", null);
          }}
        >
          <a href="#" className="navi-link">
            <span className="navi-text">
              <span className="label label-xl label-inline label-light-primary">
                By Date
              </span>
            </span>
          </a>
        </li>
      </ul>
      {/*end::Navigation*/}
    </>
  );
}
