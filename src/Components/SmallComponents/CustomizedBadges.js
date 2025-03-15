import * as React from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    backgroundColor: 'green', // Set the badge background color to green
    color: 'white', // Set the text color to white for better contrast
  },
}));

export default function CustomizedBadges({ badgeContent }) {
  return (
    <IconButton aria-label="cart">
      <StyledBadge badgeContent={badgeContent} color="secondary">
        <ShoppingCartIcon />
      </StyledBadge>
    </IconButton>
  );
}