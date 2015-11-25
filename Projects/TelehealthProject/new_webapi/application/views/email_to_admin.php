<html>
    <body>
        <b>Push notification error report. ( <?php echo $result['action']; ?> )</b>
        <br><br>
        <b>Content:</b> <?php echo $result['content']; ?>
        <br>
        <b>Device Token:</b> <?php echo $result['deviceToken']; ?>
        <br>
        <b>Payload:</b> <?php echo $result['payload']; ?>
        <br>
        <b>Error:</b> <?php echo $result['message']; ?>
        <br>
        <?php echo isset($result['afterMessage']) ? "<b>Truncated Message:</b> " . $result['afterMessage'] . "<br>" : ""; ?>
    </body>
</html>