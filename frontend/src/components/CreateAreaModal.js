import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function CreateAreaModal(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add an Area
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Area information:</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="none"
            id="name"
            label="Area name"
            onChange={props.handleChange}
            fullWidth
          />
          <TextField
            margin="none"
            id="content"
            label="Description"
            onChange={props.handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {handleClose(); props.handleSubmit(e)}} color="primary">
            Add Area
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateAreaModal;
