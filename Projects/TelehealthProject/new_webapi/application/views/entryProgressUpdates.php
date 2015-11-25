<table id="table" width="100%" border="0" cellspacing="0" cellpadding="0" class="rounded-corner">
	<tr>
    	<th style="width: 150px;">Date</th>
		<th style="text-align: left; padding-left: 50px;">Update</th>
    </tr>
    <?php if ((1!=$data['itype'])): ?>
    
    <?php foreach($data['requestProgress'] as $key => $value) : ?>
        <tr>
            <td class="top" style="vertical-align: top; text-align: right;"><?= $value['date'];?></td> 
            <td>
            	<ul>
                	<li>Current symptoms/status: <?= (array_key_exists('text1',$value))?$value['text1']:"";?></li>
                    <li>New symptoms/status: <?= (array_key_exists('text2',$value))?$value['text2']:"";?></li>
                    <li>Issues with duties: <?= (array_key_exists('text3',$value))?$value['text3']:"";?></li>
            	</ul>
            </td>    
        </tr>
	<?php endforeach; ?>
    <?php endif; ?>
    <?php if ((1==$data['itype'])): ?>
    <?php foreach($data['requestProgress'] as $key => $value) : ?>
        <tr>
            <td class="top" style="vertical-align: top; text-align: right;"><?= $value['date'];?></td> 
            <td>
            	<ul>
                	<li>Current symptoms/status: <?= $value['text1'];?></li>
                    <li>New symptoms/status: <?= $value['text2'];?></li>
                    <li>Further information: <?= $value['text3'];?></li>
            	</ul>
            </td>    
        </tr>
	<?php endforeach; ?>
    <?php endif; ?> 
</table>