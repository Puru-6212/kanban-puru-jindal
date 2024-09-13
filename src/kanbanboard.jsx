import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './kanbanboard.css';

// Importing SVG icons
import DoneIcon from './assets/icons/Done.svg';
import DownIcon from './assets/icons/down.svg';
import HighPriorityIcon from './assets/icons/Img - High Priority.svg';
import LowPriorityIcon from './assets/icons/Img - Low Priority.svg';
import MediumPriorityIcon from './assets/icons/Img - Medium Priority.svg';
import InProgressIcon from './assets/icons/in-progress.svg';
import NoPriorityIcon from './assets/icons/No-priority.svg';
import UrgentPriorityColourIcon from './assets/icons/SVG - Urgent Priority colour.svg';
import UrgentPriorityGreyIcon from './assets/icons/SVG - Urgent Priority grey.svg';
import ToDoIcon from './assets/icons/To-do.svg';
import ThreeDotMenuIcon from './assets/icons/3 dot menu.svg';
import AddIcon from './assets/icons/add.svg';
import BacklogIcon from './assets/icons/Backlog.svg';
import CancelledIcon from './assets/icons/Cancelled.svg';
import DisplayIcon from './assets/icons/Display.svg';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sortOption, setSortOption] = useState('priority');
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false); // To handle submenu toggle

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const groupTickets = (tickets, grouping) => {
    switch (grouping) {
      case 'status':
        return tickets.reduce((acc, ticket) => {
          const key = ticket.status;
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      case 'user':
        return tickets.reduce((acc, ticket) => {
          const key = users.find(user => user.id === ticket.userId)?.name || 'Unknown';
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      case 'priority':
        return tickets.reduce((acc, ticket) => {
          const key = ticket.priority;
          acc[key] = acc[key] || [];
          acc[key].push(ticket);
          return acc;
        }, {});
      default:
        return tickets;
    }
  };

  const sortedTickets = tickets.sort((a, b) => {
    if (sortOption === 'priority') {
      return b.priority - a.priority;
    } else if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const groupedTickets = groupTickets(sortedTickets, grouping);

  useEffect(() => {
    const savedGrouping = localStorage.getItem('grouping');
    const savedSortOption = localStorage.getItem('sortOption');
    if (savedGrouping) setGrouping(savedGrouping);
    if (savedSortOption) setSortOption(savedSortOption);
  }, []);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('sortOption', sortOption);
  }, [grouping, sortOption]);

  const handleDisplayClick = () => {
    setDisplayMenuOpen(!displayMenuOpen); // Toggle submenu
  };

  const handleGroupingChange = (group) => {
    setGrouping(group);
    setDisplayMenuOpen(false); // Close submenu after selection
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    setDisplayMenuOpen(false); // Close submenu after selection
  };

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="display-container" onClick={handleDisplayClick}>
          <img src={DisplayIcon} alt="Display" className="icon-display" />
          <span className="display-text">Display</span>
          {/* Submenu for grouping and sorting options */}
          {displayMenuOpen && (
            <div className="submenu">
              <div className="submenu-title">Grouping:</div>
              <p onClick={() => handleGroupingChange('status')}>By Status</p>
              <p onClick={() => handleGroupingChange('user')}>By User</p>
              <p onClick={() => handleGroupingChange('priority')}>By Priority</p>

              <div className="submenu-title">Ordering:</div>
              <p onClick={() => handleSortChange('priority')}>By Priority</p>
              <p onClick={() => handleSortChange('title')}>By Title</p>
            </div>
          )}
        </div>
      </div>

      <div className="kanban-columns">
        {Object.keys(groupedTickets).map((group) => (
          <div className="kanban-column" key={group}>
            <h3>{group}</h3>
            {groupedTickets[group].map(ticket => (
              <div className="kanban-card" key={ticket.id}>
                <img src={DoneIcon} alt="Done" className="icon" />
                <h4>{ticket.title}</h4>
                <div className="card-actions">
                  {/* Displaying appropriate priority icon */}
                  {ticket.priority === 'Urgent' && (
                    <img src={UrgentPriorityColourIcon} alt="Urgent" className="icon-priority" />
                  )}
                  {ticket.priority === 'High' && (
                    <img src={HighPriorityIcon} alt="High" className="icon-priority" />
                  )}
                  {ticket.priority === 'Medium' && (
                    <img src={MediumPriorityIcon} alt="Medium" className="icon-priority" />
                  )}
                  {ticket.priority === 'Low' && (
                    <img src={LowPriorityIcon} alt="Low" className="icon-priority" />
                  )}
                  {ticket.priority === 'No priority' && (
                    <img src={NoPriorityIcon} alt="No priority" className="icon-priority" />
                  )}
                  <span className="card-status-text">{ticket.status}</span>
                  <span className="message-count">3</span> {/* Mock number */}
                  <img src={AddIcon} alt="Add" className="icon-add" />
                  <img src={ThreeDotMenuIcon} alt="Menu" className="icon-menu" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;