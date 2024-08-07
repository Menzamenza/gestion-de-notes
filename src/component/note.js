import React from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRCYY-FcnFycHIiVlRWiLw-L5AUxdQK9I",
    authDomain: "examen-react-10b3d.firebaseapp.com",
    projectId: "examen-react-10b3d",
    storageBucket: "examen-react-10b3d.appspot.com",
    messagingSenderId: "539810802389",
    appId: "1:539810802389:web:0c01d33d786fa7c35dd05c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
const db = getFirestore(app);

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputTitle: "",
            inputContent: "",
            inputDate: "",
            notes: []
        };
    }

    addNotes = async () => {
        if (!this.state.inputTitle || !this.state.inputContent || !this.state.inputDate) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        const newNote = {
            title: this.state.inputTitle,
            content: this.state.inputContent,
            date: this.state.inputDate
        };

        try {
            //mnt j'ajoute une collection 
            await addDoc(collection(db, "notes"), newNote);

            //met à jour le tableau et remet les inputs à vide
            this.setState({
                notes: [newNote,...this.state.notes],
                inputTitle: "",
                inputContent: "",
                inputDate: ""
            });
        } catch (error) {
            console.log(error);
        }
    }

    recuperation = async () => {

        const querySnapshot = await getDocs(collection(db, "notes"));
        querySnapshot.forEach((doc) => {
            
            const notesExistantes = querySnapshot.docs.map(doc => ({
                title: doc.data().title,
                content: doc.data().content,
                date: doc.data().date
            }));
            {
                this.setState({

                    notes: notesExistantes
                })
            }
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    }

    componentDidMount() {
        this.recuperation()
    }


    render() {
        return (

            <div className="container-fluid py-3 bg-dark text-white">

                <div className="row">
                    <p className="text-center fw-bold fs-5">Notes</p>
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <input
                                    value={this.state.inputTitle}
                                    onChange={(e) => this.setState({ inputTitle: e.target.value })}
                                    type="text"
                                    className="form-control"
                                    placeholder="Titre"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    value={this.state.inputContent}
                                    onChange={(e) => this.setState({ inputContent: e.target.value })}
                                    type="text"
                                    className="form-control"
                                    placeholder="Contenu"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    value={this.state.inputDate}
                                    onChange={(e) => this.setState({ inputDate: e.target.value })}
                                    type="date"
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button
                                onClick={this.addNotes}
                                className="btn btn-success col-12 mt-2"
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row col-3 m-3">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="chercher par nom..."
                    />
                </div>
                <div className="row mt-3">
                    {this.state.notes.map((note, index) => (
                        <div className="col-lg-3 col-md-6 col-sm-12 mb-3" key={index}>
                            <div className="card p-3">
                                <div className="card-body text-center fw-semibold">
                                    <p className="card-title text-info">{note.title}</p>
                                    <p className="card-text">{note.content}</p>
                                    <p className="card-text">{note.date}</p>
                                    <div className="d-flex justify-content-around align-items-center">

                                        <button
                                            className="btn btn-outline-danger ms-2">
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                        </button>
                                        <button
                                            className="btn btn-outline-danger ms-2">
                                            <i className="fa fa-pen" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Note
