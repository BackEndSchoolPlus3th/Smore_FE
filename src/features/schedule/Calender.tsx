import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Calendar, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import AddEventPopup from './AddEventPopup';
import EventDetailManagePopup from './EventDetailManagePopup';
import UpdateEventPopup from './UpdateEventPopup';
import EventDetailPopup from './EventDetailPopup';
import { apiClient } from '../../shared';
import moment from 'moment';
import './Calendar.css';
const Calender: React.FC = () => {
    const calendarRef = useRef<HTMLDivElement>(null);
    const [showAddEventPopup, setShowAddEventPopup] = useState(false);
    const [showUpdateEventPopup, setShowUpdateEventPopup] = useState(false);
    const [showEventDetailPopup, setShowEventDetailPopup] = useState(false);
    const [showEventDetailManagePopup, setShowEventDetailManagePopup] =
        useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null); // EventApi 타입으로 변경

    const [calendar, setCalendar] = useState<Calendar | null>(null);
    const [events, setEvents] = useState([]);
    const [manager, setManager] = useState<boolean>(false);
    const { studyId } = useParams<{ studyId: string }>();

    const fetchData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                throw new Error('Access token not found');
            }

            const response = await apiClient.get(
                `/api/v1/study/${studyId}/schedules`
            );
            console.log('response', response);

            // FullCalendar에서 사용할 형식으로 변환
            const formattedEvents = response.data.studyScheduleList.map(
                (event: any) => ({
                    id: event.id,
                    title: event.title,
                    start: event.startDate,
                    end: event.endDate,
                    allDay: event.allDay,
                    extendedProps: {
                        content: event.content,
                    },
                })
            );

            // const manager = response.data.userPermission;
            setEvents(formattedEvents);
            setManager(response.data.userPermission);
            console.log('manager', manager);
            // setManager()
        } catch (error) {
            console.error('API 요청 실패:', error);
        }
    };

    // # useEffect(1): 데이터 가져오기기
    useEffect(() => {
        fetchData();
    }, [studyId, manager]);

    // # useEffect(2): FullCalendar 초기화
    useEffect(() => {
        // FullCalendar 초기화
        if (calendarRef.current) {
            const newCalendar = new Calendar(calendarRef.current, {
                locale: 'ko', // 한국어 설정
                plugins: [
                    dayGridPlugin,
                    interactionPlugin,
                    momentTimezonePlugin,
                ],
                timeZone: 'Asia/Seoul', // 한국 시간대 설정
                eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prevYear,prev,next,nextYear today',
                    center: 'title',
                    right: 'addEventButton',
                },
                customButtons: {
                    addEventButton: {
                        text: 'Add Event',
                        click: function () {
                            // 관리자 여부 확인
                            if (manager) {
                                setShowAddEventPopup(true); // 모달 열기
                            } else {
                                alert('권한이 없습니다.');
                            }
                        },
                    },
                },
                dayMaxEventRows: true, // for all non-TimeGrid views
                views: {
                    timeGrid: {
                        dayMaxEventRows: 6, // adjust to 6 only for timeGridWeek/timeGridDay
                    },
                },
                eventClick: function (info) {
                    console.log('manager ', manager);
                    setSelectedEvent(info.event); // EventApi 객체 저장

                    // 관리자 여부 확인
                    if (manager) {
                        setShowEventDetailManagePopup(true);
                    } else {
                        setShowEventDetailPopup(true);
                    }
                },
                events: events,
                eventColor: '#a294f9',
            });

            newCalendar.render();
            setCalendar(newCalendar);
        }
    }, [calendarRef, events, manager]);

    // useEffect(3): 일정 목록 업데이트
    useEffect(() => {
        if (calendar) {
            calendar.removeAllEvents();
            events.forEach((event) => calendar.addEvent(event));
        }
    }, [events, calendar]);

    // 일정 추가
    const handleAddEvent = async (event: {
        title: string;
        content?: string;
        startdate: string;
        endDate?: string;
        allDay?: boolean;
    }) => {
        if (calendar) {
            const newEvent = calendar.addEvent({
                title: event.title,
                extendedProps: { content: event.content },
                start: event.startdate,
                end: event.endDate,
                allDay: event.allDay,
            });

            if (newEvent) {
                setSelectedEvent(newEvent);
            }
        }

        console.log('New Event:', event);
        console.log('Type of title:', typeof event.title, event.title);
        console.log('Type of start:', typeof event.startdate, event.startdate);
        console.log('Type of end:', typeof event.endDate, event.endDate);
        console.log('Type of allDay:', typeof event.allDay, event.allDay);
        console.log('Type of content:', typeof event.content, event.content);

        // 서버로 저장 요청
        try {
            const response = await apiClient.post(
                `/api/v1/study/${studyId}/schedules`,
                {
                    title: event.title,
                    startDate: event.startdate,
                    endDate: event.endDate || event.startdate, // endDate가 없을 경우 startdate로 설정
                    content: event.content || '', // content가 없을 경우 빈 문자열 처리
                    allDay: event.allDay || false, // allDay가 없을 경우 false로 설정
                }
            );

            console.log('서버 응답:', response);

            // 서버에서 일정 목록 다시 조회
            const newEvent = await apiClient.get(
                `/api/v1/study/${studyId}/schedules`
            );
            console.log('newEvent', newEvent);

            const formattedEvents = newEvent.data.studyScheduleList.map(
                (event: any) => ({
                    id: event.id,
                    title: event.title,
                    start: event.startDate,
                    end: event.endDate,
                    allDay: event.allDay,
                    extendedProps: {
                        content: event.content,
                    },
                })
            );

            setEvents(formattedEvents);
        } catch (error) {
            console.error('스케줄 저장 실패:', error);
        }

        setShowAddEventPopup(false);
    };

    // 일정 삭제
    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await apiClient.delete(`/api/v1/study/${studyId}/schedules`, {
                    data: {
                        id: selectedEvent.id,
                    },
                });

                selectedEvent.remove();
                setShowEventDetailPopup(false);
                setSelectedEvent(null);
            } catch (error) {
                if (error) {
                    console.error('스케줄 삭제 실패:', error);
                    alert('스케줄 삭제에 실패했습니다.');
                } else {
                    console.error('서버 요청 실패:', error);
                    alert('서버 요청에 실패했습니다.');
                }
            }
        }
    };

    // 수정 팝업 열기
    const handleEventDetailUpdate = () => {
        setShowUpdateEventPopup(true);
    };

    // 일정 수정
    const handleUpdateEvent = async (updatedEvent: {
        title: string;
        content?: string;
        startDate: string;
        endDate?: string;
        allDay?: boolean;
    }) => {
        if (selectedEvent) {
            selectedEvent.setProp('title', updatedEvent.title);
            selectedEvent.setExtendedProp('content', updatedEvent.content);

            let startDateTime = updatedEvent.startDate;
            let endDateTime = updatedEvent.endDate ?? null;
            console.log('startDateTime: ' + updatedEvent.startDate);

            if (selectedEvent.allDay) {
                startDateTime = moment(startDateTime).format('YYYY-MM-DD');
                console.log('startDateTime: ' + startDateTime);
                endDateTime = endDateTime
                    ? moment(endDateTime).format('YYYY-MM-DD')
                    : null;
            } else {
                startDateTime = moment(startDateTime).format(
                    'YYYY-MM-DDTHH:mm:ss'
                );
                console.log('startDateTime: ' + startDateTime);
                endDateTime = endDateTime
                    ? moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss')
                    : null;
            }

            selectedEvent.setStart(startDateTime);
            selectedEvent.setEnd(endDateTime);

            // 서버에 put 요청

            await apiClient.put(`/api/v1/study/${studyId}/schedules`, {
                id: selectedEvent.id,
                title: updatedEvent.title || selectedEvent.title,
                startDate: startDateTime,
                endDate: endDateTime || startDateTime,
                content:
                    updatedEvent.content ||
                    selectedEvent.extendedProps.content ||
                    '',
                allDay: selectedEvent.allDay,
            });

            console.log('Updated Event:', selectedEvent);
            setShowUpdateEventPopup(false);
            setShowEventDetailPopup(false);
        }
    };

    return (
        <>
            <div ref={calendarRef}></div>

            {showAddEventPopup && (
                <AddEventPopup
                    isOpen={showAddEventPopup}
                    onClose={() => setShowAddEventPopup(false)}
                    onAddEvent={handleAddEvent}
                />
            )}

            {showEventDetailManagePopup && selectedEvent && (
                <EventDetailManagePopup
                    isOpen={showEventDetailManagePopup}
                    event={selectedEvent}
                    onClose={() => setShowEventDetailManagePopup(false)}
                    onUpdate={handleEventDetailUpdate}
                    onDelete={handleDeleteEvent}
                />
            )}

            {showEventDetailPopup && selectedEvent && (
                <EventDetailPopup
                    isOpen={showEventDetailPopup}
                    event={selectedEvent}
                    onClose={() => setShowEventDetailPopup(false)}
                />
            )}

            {showUpdateEventPopup && selectedEvent && (
                <UpdateEventPopup
                    isOpen={showUpdateEventPopup}
                    event={selectedEvent}
                    onClose={() => setShowUpdateEventPopup(false)}
                    onUpdate={handleUpdateEvent} // 수정된 이벤트 처리
                />
            )}
        </>
    );
};

export default Calender;
