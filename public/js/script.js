document.addEventListener('DOMContentLoaded', () => {
    // Confirm delete actions (if any exist later)
    const deleteButtons = document.querySelectorAll('.btn-danger');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to delete this item?')) {
                e.preventDefault();
            }
        });
    });

    // Add visual feedback to file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                console.log('File selected:', e.target.files[0].name);
            }
        });
    });
});
