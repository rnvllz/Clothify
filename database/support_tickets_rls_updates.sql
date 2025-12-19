-- TEMPORARY: Allow all selects for testing ticket visibility
-- Run this if tickets are created but not showing in admin/employee pages

DROP POLICY IF EXISTS "allow_ticket_selects" ON support_tickets;
CREATE POLICY "temp_allow_all_selects" ON support_tickets FOR SELECT USING (true);