package Reporte.reporte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import Reporte.reporte.model.ReporteModel;

@Repository
public interface ReporteRepository extends JpaRepository<ReporteModel, Long>{

}
