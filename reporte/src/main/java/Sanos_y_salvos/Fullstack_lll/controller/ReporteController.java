package Sanos_y_salvos.Fullstack_lll.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Sanos_y_salvos.Fullstack_lll.model.ReporteModel;
import Sanos_y_salvos.Fullstack_lll.service.ReporteService;



@RestController
@RequestMapping("api/reportes")
public class MascotaController {

    private final ReporteService service;

    public MascotaController(ReporteService service) {}
}
