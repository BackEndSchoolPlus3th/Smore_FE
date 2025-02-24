import React, { useEffect, useRef } from 'react';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calender: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  let calendar: Calendar | null = null;

  useEffect(() => {
    if (calendarRef.current) {
      calendar = new Calendar(calendarRef.current, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          center: 'addEventButton'
        },
        customButtons: {
          addEventButton: {
            text: 'Add Event',
            click: function () {
              openAddEventPopup();
            }
          }
        }
      });

      calendar.render();
    }
  }, []);

  // 팝업 창을 띄우는 함수
  const openAddEventPopup = () => {
    const popup = window.open(
      '',
      'AddEventPopup',
      'width=400,height=300,top=200,left=500'
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Add Event</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              input, button { margin: 10px 0; display: block; width: 100%; }
            </style>
          </head>
          <body>
            <h2>Add New Event</h2>
            <label for="eventTitle">Title:</label>
            <input type="text" id="eventTitle" />
            <label for="eventDate">Date (YYYY-MM-DD):</label>
            <input type="date" id="eventDate" />
            <button onclick="submitEvent()">Add Event</button>
            <script>
              function submitEvent() {
                const title = document.getElementById('eventTitle').value;
                const date = document.getElementById('eventDate').value;
                
                if (!title || !date) {
                  alert('Please enter both title and date.');
                  return;
                }

                window.opener.postMessage({ title, date }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  // 이벤트 추가 메시지를 수신하는 함수
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.title && event.data?.date) {
        calendar?.addEvent({
          title: event.data.title,
          start: event.data.date,
          allDay: true
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return <div ref={calendarRef}></div>;
};

export default Calender;
