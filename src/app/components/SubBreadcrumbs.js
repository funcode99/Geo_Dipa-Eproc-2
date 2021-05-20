import React from 'react';
import { Breadcrumbs, Typography } from '@material-ui/core';
import { Card } from '../../_metronic/_partials/controls';
import { Link } from 'react-router-dom';

const defaultItems = [
  { label: 'Link 1', to: '/' },
  { label: 'Link 2', to: '/' },
  { label: 'Link 3', to: '/' },
];

export default function SubBreadcrumbs(props) {
  const { items = defaultItems } = props;

  return (
    <Card className="p-2 my-5">
      <Breadcrumbs aria-label="Breadcrumb">
        {items.map((item, index) =>
          index !== items.length - 1 ? (
            <Link
              key={`breadcrumb-${index}-${item.label}`}
              color="inherit"
              to={item.to}
            >
              {item.label}
            </Link>
          ) : (
            <Typography
              color="textPrimary"
              key={`breadcrumb-${index}-${item.label}`}
            >
              {item.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Card>
  );
}
