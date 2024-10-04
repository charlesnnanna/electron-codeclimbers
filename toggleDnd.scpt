property |System Preferences| : name of application id "com.apple.systempreferences"

on run {appListString}
    -- Split the passed string by commas to form a list
    set AppleScript's text item delimiters to ","
    set appList to text items of appListString
    
    -- Open System Preferences to the Notifications pane
    tell application id "com.apple.systempreferences"
        activate
        reveal pane id "com.apple.preference.notifications"
        delay 2 -- Ensure pane loads
    end tell
    
    -- Use System Events to interact with the UI
    tell application "System Events"
        tell process |System Preferences|
            repeat until exists window 1
                delay 0.5
            end repeat
            
            if not (exists table 1 of scroll area 1 of window 1) then
                log "Table not found. Please check the UI structure."
                return
            end if
            
            -- Process each app in the list
            repeat with targetApp in appList
                log "Processing app: " & targetApp
                try
                    set appRow to row 1 of table 1 of scroll area 1 of window 1 whose value of static text 1 of group 1 of UI element 1 contains targetApp
                    select appRow
                    delay 0.5
                    
                    -- Look for the "Allow Notifications" toggle button
                    set allowToggle to button 1 of group 1 of window 1 whose description contains "Allow Notifications"
                    
                    set currentState to value of attribute "AXValue" of allowToggle
                    log "Current 'Allow Notifications' state for " & targetApp & ": " & currentState
                    
                    click allowToggle
                    delay 0.5
                    
                    set newState to value of attribute "AXValue" of allowToggle
                    log "New 'Allow Notifications' state for " & targetApp & ": " & newState
                on error errMsg
                    log "Error processing " & targetApp & ": " & errMsg
                end try
            end repeat
        end tell
    end tell
    
    tell application id "com.apple.systempreferences" to quit
end run