import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./containers/Login";
import Signup from "./containers/Signup";
import StudentInsights from "./containers/StudentInsights";
import AssignmentList from "./containers/AssignmentList";
import AssignmentDetail from "./containers/AssignmentDetail";
import AssignmentCreate from "./containers/AssignmentCreate";
import AssignmentUpdate from "./containers/AssignmentUpdate";
import AssignmentSubmitted from "./containers/AssignmentSubmitted";
import AssignmentStart from "./containers/AssignmentStart";
import TeacherAssgnInsightDetail from "./containers/TeacherAssgnInsightDetail";
import RequireAuth from "./components/RequireAuth";
import TeacherAssgnInsights from "./components/TeacherAssgnInsights";



//private route

const time = new Date();
time.setSeconds(time.getSeconds() + 600);

const BaseRouter = () => (
  <Routes>
    <Route exact path="/create/" element={<RequireAuth><AssignmentCreate /></RequireAuth>} />
    <Route exact path="/update/:id" element={<RequireAuth><AssignmentUpdate /></RequireAuth>} />
    <Route exact path="/login/" element={<Login />} />
    <Route exact path="/signup/" element={<Signup />} />
    <Route exact path="/assignments/:id" element={<RequireAuth><AssignmentDetail /></RequireAuth>} />
    <Route exact path="/insights/" element={<RequireAuth><TeacherAssgnInsights /></RequireAuth>} />
    <Route exact path="/insight-detail/:asntId" element={<RequireAuth><TeacherAssgnInsightDetail /></RequireAuth>} />
    <Route exact path="/assignment-start/:asntId/:title" element={<RequireAuth><AssignmentStart /></RequireAuth>} />
    <Route exact path="/assignmentSubmitted/" element={<AssignmentSubmitted />} />

    <Route exact path="/student-insights/:id"
      element={
        <RequireAuth><StudentInsights /></RequireAuth>
      } />

    <Route
      path="/"
      element={
        <RequireAuth><AssignmentList /></RequireAuth>
      }
    />
  </Routes>
);

export default BaseRouter;
