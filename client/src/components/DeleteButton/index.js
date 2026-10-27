import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiTrash2 } from 'react-icons/fi';

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
      <button className='sw-icon-btn is-danger' onClick={handleShow} aria-label='Delete loss' title='Delete loss'>
        <FiTrash2 size='20' />
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete this loss?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-0">This removes the entry and its photo. You can't undo this.</p>
          {error && <span className="sw-alert mt-3 mb-0" role="alert">Couldn't delete the loss. Try again.</span>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="link" onClick={handleClose}>Keep it</Button>
          <Button variant="danger" onClick={() => handleDelete(props.ID)}>Delete loss</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteModal;