import React, { useState, FormEvent } from "react";

import "./styles.css";

import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";
import Input from "../../components/Input";
import Select from "../../components/Select";
import api from "../../services/api";

function TeacherList() {
  const [subject, setSubject] = useState("");
  const [week_day, setWeek_day] = useState("");
  const [time, setTime] = useState("");
  const [teachers, setTeachers] = useState([]);

  async function searchTeachers(e: FormEvent) {
    e.preventDefault();

    const response = await api.get("classes", {
      params: {
        subject,
        week_day,
        time,
      },
    });

    setTeachers(response.data);
  }

  return (
    <div id="page-teacher-list" className="container">
      <PageHeader title="Estes são os proffys disponíveis">
        <form id="search-teachers" onSubmit={searchTeachers}>
          <Select
            label="Matéria"
            name="subject"
            value={subject}
            options={[
              { value: "Artes", label: "Artes" },
              { value: "Matematica", label: "Matemática" },
              { value: "Ciências", label: "Ciências" },
              { value: "Geografia", label: "Geografia" },
              { value: "Português", label: "Português" },
              { value: "História", label: "História" },
            ]}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Select
            label="Dia da semana"
            name="weekday"
            value={week_day}
            options={[
              { value: "0", label: "Domingo" },
              { value: "1", label: "Segunda-feira" },
              { value: "2", label: "Terça-feira" },
              { value: "3", label: "Quarta-feira" },
              { value: "4", label: "Quinta-feira" },
              { value: "5", label: "Sexta-feira" },
              { value: "6", label: "Sábado" },
            ]}
            onChange={(e) => setWeek_day(e.target.value)}
          />
          <Input
            label="Hora"
            name="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>
      </PageHeader>

      <main>
        {teachers.map((teacher: Teacher) => {
          return <TeacherItem key={teacher.id} teacher={teacher} />;
        })}
      </main>
    </div>
  );
}

export default TeacherList;
