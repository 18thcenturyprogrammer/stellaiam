import React, { Component, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'


const MenuComponent =()=>{
  console.log("window.location :",window.location);

  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState(window.location.pathname);
  

  const handleItemClick = (e, btn ) => {

    console.log("handleItemClick called");
    console.log("e : ",e);
    console.log("btn :",btn);

    switch (btn.name){
        case 'mint_SBT':
            console.log("mint_SBT menu is clicked");
            navigate("/mint_sbt_with_sns");
            break;
        case 'my_SBT':
            console.log("my_SBT menu is clicked");
            navigate("/my_sbt");
            break;
        case 'test_dashboard':
            console.log("test_dashboard menu is clicked");
            navigate("/test_dashboard");          
            break;
    }
    setActiveItem(btn.name);
}

  
    return (
      <div>
        <Menu pointing>
          <Menu.Item
            name='mint_SBT'
            active={activeItem === '/mint_sbt_with_sns'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='my_SBT'
            active={activeItem === '/my_sbt'}
            onClick={handleItemClick}
          />

          <Menu.Item
            name='test_dashboard'
            active={activeItem === '/test_dashboard'}
            onClick={handleItemClick}
          />
          
        </Menu>
      </div>
    )
  


};

export default MenuComponent;