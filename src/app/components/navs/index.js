import React from "react";
import { Nav } from "react-bootstrap";

const initialNavLists = [
  { id: "link-item-1", label: "Item 1" },
  { id: "link-item-2", label: "Item 2" },
  { id: "link-item-3", label: "Item 3" },
];

export default function Navs({
  navLists = initialNavLists,
  handleSelect,
  active = navLists[0].id,
  ...other
}) {
  return (
    <Nav
      variant="pills"
      defaultActiveKey={active}
      onSelect={handleSelect}
      {...other}
    >
      {navLists.map((item) => (
        <Nav.Item key={item.id}>
          <Nav.Link eventKey={item.id} style={{ fontWeight: 500 }}>
            {item.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
