package localsrc

import (
	"fmt"
	"log"

	"github.com/madhuwantha/devtime/localsrc/entity"
)

func getGroupByClause(groupBy string) string {
	switch groupBy {
	case "weekly":
		return "strftime('%Y-W%W', start_time)" // e.g., 2025-W36
	case "monthly":
		return "strftime('%Y-%m', start_time)" // e.g., 2025-09
	default: // daily
		return "date(start_time)"
	}
}

// A. Total Work Time
func GetWorkTimeSummary(groupBy string) ([]entity.WorkSummary, error) {
	groupClause := getGroupByClause(groupBy)

	query := fmt.Sprintf(`
        SELECT 
            %s AS period,
            ROUND(SUM((julianday(end_time) - julianday(start_time)) * 24), 2) AS total_hours
        FROM worklog
        WHERE is_pause = 0
        GROUP BY period
        ORDER BY period DESC;
    `, groupClause)

	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.WorkSummary
	for rows.Next() {
		var s entity.WorkSummary
		if err := rows.Scan(&s.Date, &s.TotalHours); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}

// B. Total Idle Time
func GetIdleTimeSummary(groupBy string) ([]entity.IdleSummary, error) {
	groupClause := getGroupByClause(groupBy)

	query := fmt.Sprintf(`
        SELECT 
            %s AS period,
            ROUND(SUM((julianday(end_time) - julianday(start_time)) * 24), 2) AS idle_hours
        FROM idlelog
        GROUP BY period
        ORDER BY period DESC;
    `, groupClause)

	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.IdleSummary
	for rows.Next() {
		var s entity.IdleSummary
		if err := rows.Scan(&s.Date, &s.IdleHours); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}

// C. Time Spent per Project
func GetProjectTimeSummary(groupBy string) ([]entity.ProjectSummary, error) {
	groupClause := getGroupByClause(groupBy)

	query := fmt.Sprintf(`
        SELECT 
            p.name AS project_name,
            %s AS period,
            ROUND(SUM((julianday(t.end_time) - julianday(t.start_time)) * 24), 2) AS hours_spent
        FROM timelog t
        LEFT JOIN project p ON p.project_id = t.project_id
        GROUP BY p.name, period
        ORDER BY period DESC, hours_spent DESC;
    `, groupClause)

	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.ProjectSummary
	for rows.Next() {
		var s entity.ProjectSummary
		if err := rows.Scan(&s.ProjectName, &s.Period, &s.HoursSpent); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}

// D. Time Spent per Task
func GetTaskTimeSummary(groupBy string) ([]entity.TaskSummary, error) {
	groupClause := getGroupByClause(groupBy)

	query := fmt.Sprintf(`
        SELECT 
            tk.name AS task_name,
            p.name AS project_name,
            %s AS period,
            ROUND(SUM((julianday(t.end_time) - julianday(t.start_time)) * 24), 2) AS hours_spent
        FROM timelog t
        LEFT JOIN task tk ON tk.task_id = t.task_id
        LEFT JOIN project p ON p.project_id = t.project_id
        GROUP BY tk.name, p.name, period
        ORDER BY period DESC, hours_spent DESC;
    `, groupClause)

	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.TaskSummary
	for rows.Next() {
		var s entity.TaskSummary
		if err := rows.Scan(&s.TaskName, &s.ProjectName, &s.Period, &s.HoursSpent); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}

// E. Productivity Percentage Per Day
func GetProductivitySummary(groupBy string) ([]entity.ProductivitySummary, error) {
	groupClause := getGroupByClause(groupBy)

	query := fmt.Sprintf(`
        WITH work AS (
            SELECT %s AS period,
                   SUM((julianday(end_time) - julianday(start_time)) * 24) AS total_hours
            FROM worklog
            WHERE is_pause = 0
            GROUP BY period
        ),
        idle AS (
            SELECT %s AS period,
                   SUM((julianday(end_time) - julianday(start_time)) * 24) AS idle_hours
            FROM idlelog
            GROUP BY period
        )
        SELECT 
            work.period,
            ROUND(((work.total_hours - IFNULL(idle.idle_hours, 0)) * 100.0) / work.total_hours, 2) AS productivity_percent
        FROM work
        LEFT JOIN idle ON work.period = idle.period
        ORDER BY work.period DESC;
    `, groupClause, groupClause)

	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.ProductivitySummary
	for rows.Next() {
		var s entity.ProductivitySummary
		if err := rows.Scan(&s.Date, &s.ProductivityPercent); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}

// F. Peak Productivity Hours
func GetPeakProductivityHours() ([]entity.PeakHourSummary, error) {
	query := `
        SELECT 
            STRFTIME('%H', start_time) AS hour,
            ROUND(SUM((julianday(end_time) - julianday(start_time)) * 24), 2) AS hours_spent
        FROM timelog
        GROUP BY hour
        ORDER BY hours_spent DESC;
    `
	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("query failed: %v", err)
	}
	defer rows.Close()

	var summaries []entity.PeakHourSummary
	for rows.Next() {
		var s entity.PeakHourSummary
		if err := rows.Scan(&s.Hour, &s.HoursSpent); err != nil {
			log.Printf("scan failed: %v", err)
			continue
		}
		summaries = append(summaries, s)
	}
	return summaries, nil
}
