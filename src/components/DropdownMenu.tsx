import React, { useState } from "react";

import { IconButton, Menu, MenuItem } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

export const DropdownMenu = ({ tagIndex }: { tagIndex: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="medium"
        onClick={handleClick}
        sx={{ marginLeft: "4px", padding: "2px" }}
      >
        <ArrowDropDown fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Rename</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
        <MenuItem onClick={handleClose}>Details</MenuItem>
      </Menu>
    </>
  );
};
