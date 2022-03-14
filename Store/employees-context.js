import { createContext, useState, useEffect } from 'react';

const DataState =
{
  amount: '0',
  NavState: false,
  Presets: []
}
const EmployeesContext = createContext(DataState);

export function EmployeesContextProvider(props) {
  const [userEmployees, setUserEmployees] = useState(DataState);
  const [NavState, setNavState] = useState(false);
  const [Presets, setPresets] = useState([]);

  useEffect(() => {
    var token = JSON.stringify(localStorage.getItem('token'))
    fetch(
      'api/getPresets',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: token
      })
      .then((res) => res.json())
      .then((data) => {
        const presets = [];

        for (const key in data) {
          const preset = {
            _id: key,
            ...data[key]
          };

          presets.push(preset);
        }
        setPresets((oldPresets) => {
          let prevPresets = oldPresets
          prevPresets = presets
          return prevPresets
        });
      })
      .catch((err) => {
        setNav(false)
      });
  }, []);

  function setEmployeeCount(newCount) {
    setUserEmployees((oldUserEmployees) => {
      let prevUserEmployees = JSON.parse(JSON.stringify(oldUserEmployees))
      prevUserEmployees.amount = newCount
      return prevUserEmployees
    });
  }

  function getEmployeeCount() {
    return userEmployees.amount
  }

  function setNav(logged) {
    setNavState(logged);
  }

  function getNav() {
    return NavState
  }

  function getLoginState() {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      if (localStorage.getItem('token')) {
        setNavState(true);
      }
    }
  }

  async function addPreset(preset) {
    var data = {
      preset: preset,
      token: localStorage.getItem('token')
    }
    const response = await fetch('api/setPresets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    setPresets((oldPresets) => {
      let prevPresets = oldPresets
      return prevPresets.concat(preset)
    });
  }

  async function removePreset(presetId) {
    var data = {
      id: presetId,
      token: localStorage.getItem('token')
    }
    const response = await fetch('api/deletePresets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    setPresets((prevPresets) => {
       return prevPresets.filter(preset => preset._id !== presetId);
    });
  }

  function getPresets() {
    return Presets
  }

  const context = {
    Employees: userEmployees,
    update: setEmployeeCount,
    getEmployeeCount: getEmployeeCount,
    setNav: setNav,
    getNav: getNav,
    getLoginState: getLoginState,
    addPreset: addPreset,
    getPresets: getPresets,
    removePreset: removePreset
  };

  return (
    <EmployeesContext.Provider value={context}>
      {props.children}
    </EmployeesContext.Provider>
  );
}

export default EmployeesContext;