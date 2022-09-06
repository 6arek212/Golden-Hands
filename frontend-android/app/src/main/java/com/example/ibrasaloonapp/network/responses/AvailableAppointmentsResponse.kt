package com.example.ibrasaloonapp.network.responses

import com.example.ibrasaloonapp.network.model.AppointmentDto

data class AvailableAppointmentsResponse(
    val message: String,
    val availableAppointments: List<AppointmentDto>
) {
}