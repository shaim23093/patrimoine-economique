import React, { useState, useEffect } from 'react'; 
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Possession from '../../patrimoine-economique/models/possessions/Possession.js';
import Patrimoine from '../../patrimoine-economique/models/Patrimoine.js';
import Personne from '../../patrimoine-economique/models/Personne.js';
import Flux from '../../patrimoine-economique/models/possessions/Flux.js';

const rakot = new Personne("rakot");
let tableau = [];

function DataTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('./data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur des données');
        }
        return response.json();
      })
      .then((jsonData) => {
        const possessions = jsonData.find(item => item.model === "Patrimoine").data.possessions;
        setData(possessions);
      })
      .catch((error) => {
        console.error('Erreur:', error);
      });
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Valeur</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Taux d'Amortissement</th>
              <th>Jour</th>
              <th>Valeur Actuel</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              let possession;
              if (item.valeurConstante) {
                possession = new Flux(rakot, item.libelle, item.valeurConstante, new Date(item.dateDebut), new Date(item.dateFin), item.tauxAmortissement, item.jour);
              } else {
                possession = new Possession(rakot, item.libelle, item.valeur, new Date(item.dateDebut), new Date(item.dateFin), item.tauxAmortissement, item.jour);
              }
              tableau.push(possession);

              return (
                <tr key={index}>
                  <td>{possession.libelle}</td>
                  <td>{possession.valeur || possession.valeurConstante}</td>
                  <td>{possession.dateDebut.toDateString()}</td>
                  <td>{possession.dateFin.toDateString() || '0'}</td>
                  <td>{possession.tauxAmortissement || '0'}</td>
                  <td>{possession.jour || '0'}</td>
                  <td>{possession.getValeur(new Date()) || '0'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
}

function PatrimoineValue() {
  const patrimoine = new Patrimoine(rakot, tableau);
  const [dateValue, setDateValue] = useState('');
  const [valeurPatrimoine, setValeurPatrimoine] = useState(null);

  const calculerValeur = () => {
    const valeur = patrimoine.getValeur(new Date(dateValue));
    setValeurPatrimoine(valeur);
  };

  return (
    <div>
      <input 
        type="date" 
        name="date" 
        id="date" 
        value={dateValue} 
        onChange={(event) => setDateValue(event.target.value)} 
      />
      <input 
        type="button" 
        value="Calculer" 
        onClick={calculerValeur} 
      />
      {valeurPatrimoine !== null && (
        <p>Valeur du patrimoine  : {valeurPatrimoine} Ar</p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1>Tableau des Possessions</h1>
      <DataTable />
      <h2>Calcul du Patrimoine</h2>
      <PatrimoineValue />
    </div>
  );
}
