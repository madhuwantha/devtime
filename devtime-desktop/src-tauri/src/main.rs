// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// fn main() {
//     devtime_desktop_lib::run()
// }


// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use std::process::Command;

/// Runs a Cobra CLI command and returns its stdout or stderr.
#[command]
fn run_cli_command(args: Vec<String>) -> Result<String, String> {
    // If your CLI binary is bundled, use a path like "./bin/mycli" or resolve via resource_dir
    let output = Command::new("../../bin/devtime")
        .args(args)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_cli_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
