import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaTrash } from 'react-icons/fa';

function DeleteModal(props) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function handleDelete(id){
        try{
            const res = await fetch(`/lossEvent/deleteLossEvent/${id}?_method=DELETE`, {
            'method': "POST",
            })
            if (!res.ok) {
                throw new Error('Failed to delete loss event')
            }
            props.setPosts(prev => prev.filter(e => e._id !== id))
            console.log('Loss event deleted')
            handleClose()
        }
        catch(err) {
            console.log(err)
            setError(true)
        }
    }

  return (
    <>
      <button className='tw-border-none tw-bg-transparent' onClick={handleShow}>
        <FaTrash size='25' color='gray' />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this loss event?</Modal.Title>
        </Modal.Header>

        
        <Modal.Footer>
            {error  && <span className="alert alert-danger">Deletion failed</span>}
          <Button variant="primary" onClick={() => handleDelete(props.ID)}>Yes, delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;