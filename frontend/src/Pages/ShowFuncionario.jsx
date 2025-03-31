import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate ,useParams } from "react-router-dom";
import '../Assets/HomePage.css'
import MenuBar from "../Components/MenuBar";
import TopBar from "../Components/TopBar";
import FeedbackPopup from "../Components/FeedbackPopup";
import ProfilePage from "../Components/ProfilePage";



export default function ShowFuncionario({viewUrl}){
    const {id} = useParams()
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [username, setUsername] = useState('');
    const [IsAdmin,setIsAdmin] = useState('')
    const [formData,setFormData] = useState('')

    const closeFeedback = () => {
        setFeedback({ message: '', type: '' });
      };
      
      
    
    useEffect(() => {
        axios.get('http://localhost:5000/session', { withCredentials: true })
            .then(response => {
                if (response.data.permission === 'OK') {
                    setUsername(response.data.user);
                    setIsAdmin(response.data.isAdm);
                } else {
                    navigate('/');
                }
            })
            .catch(() => navigate('/'));
    }, [navigate]);

    useEffect(() => {
      axios.get('http://localhost:5000/FormAtualizarFuncionario/' + id, { withCredentials: true })
          .then(response => {
              if (response.data.funcionario) {
                  console.log(response.data.funcionario)
                  setFormData(response.data.funcionario);
              } else {

              }
          })
          .catch();
  }, [navigate]);
    
    return (
        <>
        <TopBar Titulo={"Sistema Academia"} Username={username} IsAdmin={IsAdmin}/>
        <div class="home-page">
            <MenuBar isAdm={IsAdmin}/>
            <ProfilePage ProfileData={formData}/>
            <FeedbackPopup message={feedback.message} type={feedback.type} onClose={closeFeedback} />
        </div>
        </>
    );
}