import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { useAuth } from '../../hooks/auth';
import api from '../../services/apiClient';

import { 
    Container, 
    Header, 
    HeaderContent, 
    Profile, 
    Content, 
    Schedule, 
    NextAppointment,
    Section,
    Appointment, 
    Calendar 
} from './styles';

import logoImg from '../../assets/logo.svg';


interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface IAppointment {
    id: string;
    date: string;
    hourFormatted: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {

    const [ selectedDate, setSelectedDate ] = useState(new Date());
    const [ currentMonth, setCurrentMonth ] = useState(new Date());

    const [ monthAvailability, setMonthAvailability ] = useState<MonthAvailabilityItem[]>([]);
    const [ appointments, setAppointments ] = useState<IAppointment[]>([]);

    const { signOut, user } = useAuth();

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available && !modifiers.disabled) {
            setSelectedDate(day);
        } 
    },[]);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month); 
    },[]);

    useEffect(() => {
        api.get(`/providers/${user && user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1,
            }
        }).then( response => {
            setMonthAvailability(response.data);
        });
    }, [currentMonth, user]);


    useEffect(() => {
        api.get<IAppointment[]>('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        }).then( response => {
            const appointmentsFormatted = response.data.map(appointment => {
                return {
                    ...appointment,
                    hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
                }
            })
            setAppointments(appointmentsFormatted)
        });
    }, [selectedDate]);


    const disabledDays = useMemo(() => {
        const dates = monthAvailability
            .filter( monthDay => monthDay.available === false)
            .map( monthDay => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth(); 
                return new Date(year, month, monthDay.day);
            });

        return dates;

    }, [currentMonth, monthAvailability]);


    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR,
        })
    }, [selectedDate]);


    const selectedWeekDay = useMemo(() => {
        const weekDay = format(selectedDate, 'cccc', {
            locale: ptBR,
        });

        if (weekDay === 'sabado' || weekDay === 'domingo') {
            return weekDay;
        }

        return `${weekDay}-feira`;
    }, [selectedDate]);

    
    const morningAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        })
    }, [appointments]);

    
    const afternoonAppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        })
    }, [appointments]);


    const nextAppointment = useMemo(() => {
        return appointments.find(appointment => 
            isAfter(parseISO(appointment.date), new Date())    
        )
    }, [appointments]);


    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img 
                            src="https://avatars1.githubusercontent.com/u/39344416?s=460&u=4f951f8adfe8f5759d7c0981d49a047522745a19&v=4" 
                            alt="GoBarber" />
                        <div>
                            <span>Bem vindo</span>
                            <Link to="profile"><strong>{ user && user.name }</strong></Link>
                        </div>
                    </Profile>
                    <button onClick={signOut}>
                        <FiPower size={24}/>
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        { isToday(selectedDate) && <span>Hoje</span> }
                        <span>{ selectedDateAsText }</span>
                        <span>{ selectedWeekDay }</span>
                    </p>
                    
                    { (isToday(selectedDate) && nextAppointment) && ( 
                        <NextAppointment>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img 
                                    src={nextAppointment.user.avatar_url} 
                                    alt={nextAppointment.user.name}
                                />
                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.hourFormatted}
                                </span>
                            </div>
                        </NextAppointment> 
                    )}
                    <Section>
                        <strong>Manhã</strong>

                        { morningAppointments.length === 0 && (
                           <p>Nenhum agendamento nesse período</p> 
                        )}

                        { morningAppointments.map( appointment => (
                            <Appointment>
                                <span>
                                    <FiClock/>
                                    {appointment.hourFormatted}
                                </span>
                                <div>
                                    <img 
                                        src={appointment.user.avatar_url}  
                                        alt={appointment.user.name} 
                                    />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                    <Section>
                        <strong>Tarde</strong>

                        { afternoonAppointments.length === 0 && (
                           <p>Nenhum agendamento nesse período</p> 
                        )}

                        { afternoonAppointments.map( appointment => (
                            <Appointment>
                                <span>
                                    <FiClock/>
                                    {appointment.hourFormatted}
                                </span>
                                <div>
                                    <img 
                                        src={appointment.user.avatar_url}  
                                        alt={appointment.user.name} 
                                    />
                                    <strong>{appointment.user.name}</strong>
                                </div>
                            </Appointment>
                        ))}
                    </Section>
                </Schedule>
                <Calendar>
                    <DayPicker 
                        weekdaysShort={['D','S','T','Q','Q','S','S']}
                        fromMonth={new Date()}
                        disabledDays={[{daysOfWeek: [0, 6]}, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5]}
                        }}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        selectedDays={selectedDate}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro'
                        ]}
                    />
                </Calendar>
            </Content>
        </Container>    
    );
}

export default Dashboard;